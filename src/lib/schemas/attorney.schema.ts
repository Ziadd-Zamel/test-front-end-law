import { z } from "zod";

const noScriptMessage = "المحتوى يحتوي على أكواد غير مسموح بها";

const numbersOnlyMessage = "يجب أن يحتوي رقم الوكالة على أرقام فقط";

// NUCLEAR OPTION: Block EVERYTHING except <p>, <ul>, <ol>, <li>
const sanitizeRichText = (val: string): boolean => {
  if (!val) return true;

  const lowerVal = val.toLowerCase();

  // ============================================
  // PHASE 1: ALL POSSIBLE CODE INJECTION PATTERNS
  // ============================================
  const codeInjectionPatterns = [
    // === JAVASCRIPT & XSS ===
    /javascript:/gi,
    /data:text\/html/gi,
    /data:text\/javascript/gi,
    /data:application\/javascript/gi,
    /vbscript:/gi,
    /livescript:/gi,
    /mocha:/gi,
    /on\w+\s*=/gi, // onclick, onerror, onload, etc.
    /<script[\s/>]/gi,
    /<\/script>/gi,
    /<noscript/gi,

    // === HTML DANGEROUS TAGS ===
    /<iframe[\s/>]/gi,
    /<frame[\s/>]/gi,
    /<frameset[\s/>]/gi,
    /<object[\s/>]/gi,
    /<embed[\s/>]/gi,
    /<applet[\s/>]/gi,
    /<link[\s/>]/gi,
    /<style[\s/>]/gi,
    /<form[\s/>]/gi,
    /<input[\s/>]/gi,
    /<button[\s/>]/gi,
    /<select[\s/>]/gi,
    /<textarea[\s/>]/gi,
    /<meta[\s/>]/gi,
    /<base[\s/>]/gi,
    /<img[\s/>]/gi,
    /<svg[\s/>]/gi,
    /<audio[\s/>]/gi,
    /<video[\s/>]/gi,
    /<source[\s/>]/gi,
    /<track[\s/>]/gi,
    /<canvas[\s/>]/gi,
    /<map[\s/>]/gi,
    /<area[\s/>]/gi,
    /<a[\s/>]/gi,
    /<div[\s/>]/gi,
    /<span[\s/>]/gi,
    /<table[\s/>]/gi,
    /<tr[\s/>]/gi,
    /<td[\s/>]/gi,
    /<th[\s/>]/gi,
    /<thead[\s/>]/gi,
    /<tbody[\s/>]/gi,
    /<tfoot[\s/>]/gi,
    /<h1[\s/>]/gi,
    /<h2[\s/>]/gi,
    /<h3[\s/>]/gi,
    /<h4[\s/>]/gi,
    /<h5[\s/>]/gi,
    /<h6[\s/>]/gi,
    /<header[\s/>]/gi,
    /<footer[\s/>]/gi,
    /<nav[\s/>]/gi,
    /<section[\s/>]/gi,
    /<article[\s/>]/gi,
    /<aside[\s/>]/gi,
    /<main[\s/>]/gi,
    /<details[\s/>]/gi,
    /<summary[\s/>]/gi,
    /<dialog[\s/>]/gi,
    /<marquee[\s/>]/gi,
    /<blink[\s/>]/gi,
    /<keygen[\s/>]/gi,
    /<command[\s/>]/gi,
    /<menu[\s/>]/gi,
    /<menuitem[\s/>]/gi,

    // === PHP INJECTION ===
    /<\?php/gi,
    /<\?=/gi,
    /<\?[\s\r\n]/gi,
    /\?>/gi,
    /\binclude\s*\(/gi,
    /\brequire\s*\(/gi,
    /\binclude_once\s*\(/gi,
    /\brequire_once\s*\(/gi,
    /\beval\s*\(/gi,
    /\bassert\s*\(/gi,
    /\bpreg_replace\s*\(.*\/e/gi,
    /\bcreate_function\s*\(/gi,
    /\bexec\s*\(/gi,
    /\bsystem\s*\(/gi,
    /\bpassthru\s*\(/gi,
    /\bshell_exec\s*\(/gi,
    /\bproc_open\s*\(/gi,
    /\bpopen\s*\(/gi,
    /\bcurl_exec\s*\(/gi,
    /\bcurl_multi_exec\s*\(/gi,
    /\bparse_ini_file\s*\(/gi,
    /\bshow_source\s*\(/gi,
    /\bhighlight_file\s*\(/gi,
    /\bfpassthru\s*\(/gi,
    /\bexpect_popen\s*\(/gi,
    /\bpcntl_exec\s*\(/gi,
    /\bproc_nice\s*\(/gi,
    /\bproc_terminate\s*\(/gi,
    /\bproc_get_status\s*\(/gi,
    /\bproc_close\s*\(/gi,
    /\bapache_child_terminate\s*\(/gi,
    /\bposix_kill\s*\(/gi,
    /\bposix_mkfifo\s*\(/gi,
    /\bposix_setpgid\s*\(/gi,
    /\bposix_setsid\s*\(/gi,
    /\bposix_setuid\s*\(/gi,
    /\bdl\s*\(/gi,
    /\bextract\s*\(/gi,
    /\bputenv\s*\(/gi,
    /\bini_set\s*\(/gi,
    /\bmail\s*\(/gi,
    /\bheader\s*\(/gi,
    /\bproc_open\s*\(/gi,
    /\bfsockopen\s*\(/gi,
    /\bmove_uploaded_file\s*\(/gi,
    /\bchmod\s*\(/gi,
    /\bchown\s*\(/gi,
    /\bchgrp\s*\(/gi,
    /\bsymlink\s*\(/gi,
    /\blink\s*\(/gi,
    /\bunlink\s*\(/gi,
    /\brename\s*\(/gi,
    /\bcopy\s*\(/gi,
    /\btmpfile\s*\(/gi,
    /\btempnam\s*\(/gi,

    // === ASP / .NET INJECTION ===
    /<%/gi,
    /%>/gi,
    /\bResponse\.Write/gi,
    /\bRequest\.Form/gi,
    /\bRequest\.QueryString/gi,
    /\bServer\.Execute/gi,
    /\bServer\.Transfer/gi,
    /\bEval\(/gi,

    // === PYTHON INJECTION ===
    /\b__import__\s*\(/gi,
    /\bcompile\s*\(/gi,
    /\bexecfile\s*\(/gi,
    /\binput\s*\(/gi,
    /\bopen\s*\(/gi,
    /\bfile\s*\(/gi,
    /\bos\.system/gi,
    /\bos\.popen/gi,
    /\bos\.execl/gi,
    /\bos\.execle/gi,
    /\bos\.execlp/gi,
    /\bos\.execlpe/gi,
    /\bos\.execv/gi,
    /\bos\.execve/gi,
    /\bos\.execvp/gi,
    /\bos\.execvpe/gi,
    /\bsubprocess/gi,
    /\bpickle\.loads/gi,
    /\bcPickle\.loads/gi,
    /\bmarshall\.loads/gi,

    // === RUBY INJECTION ===
    /\bsystem\(/gi,
    /\bexec\(/gi,
    /\beval\(/gi,
    /\b`.*`/gi,
    /\b%x\{/gi,
    /\bKernel\.system/gi,
    /\bIO\.popen/gi,
    /\bOpen3\.popen/gi,

    // === JAVA INJECTION ===
    /\bRuntime\.getRuntime\(\)\.exec/gi,
    /\bProcessBuilder/gi,
    /\bClass\.forName/gi,
    /\bMethod\.invoke/gi,
    /\bScriptEngineManager/gi,

    // === NODE.JS INJECTION ===
    /\brequire\s*\(/gi,
    /\bchild_process/gi,
    /\bprocess\.binding/gi,
    /\bvm\.runInNewContext/gi,
    /\bvm\.runInThisContext/gi,
    /\bFunction\s*\(/gi,
    /\bsetTimeout\s*\(/gi,
    /\bsetInterval\s*\(/gi,

    // === SQL INJECTION ===
    /\bSELECT\s+.*\s+FROM/gi,
    /\bINSERT\s+INTO/gi,
    /\bUPDATE\s+.*\s+SET/gi,
    /\bDELETE\s+FROM/gi,
    /\bDROP\s+(TABLE|DATABASE|SCHEMA|INDEX|VIEW)/gi,
    /\bCREATE\s+(TABLE|DATABASE|SCHEMA|INDEX|VIEW)/gi,
    /\bALTER\s+(TABLE|DATABASE|SCHEMA)/gi,
    /\bTRUNCATE\s+TABLE/gi,
    /\bUNION\s+(ALL\s+)?SELECT/gi,
    /\bEXEC\s*\(/gi,
    /\bEXECUTE\s*\(/gi,
    /\bsp_executesql/gi,
    /\bxp_cmdshell/gi,
    /\bINTO\s+OUTFILE/gi,
    /\bLOAD_FILE/gi,
    /\bINTO\s+DUMPFILE/gi,
    /\bAND\s+1\s*=\s*1/gi,
    /\bOR\s+1\s*=\s*1/gi,
    /\bAND\s+'1'\s*=\s*'1/gi,
    /\bOR\s+'1'\s*=\s*'1/gi,
    /--[^\r\n]*/g, // SQL comments
    /;.*(\bDROP|\bDELETE|\bUPDATE|\bINSERT)/gi,
    /\bBENCHMARK\s*\(/gi,
    /\bSLEEP\s*\(/gi,
    /\bwaitfor\s+delay/gi,
    /\bpg_sleep/gi,

    // === LDAP INJECTION ===
    /\*\)/gi,
    /\|\(/gi,
    /&\(/gi,

    // === XML/XXE INJECTION ===
    /<!ENTITY/gi,
    /<!DOCTYPE/gi,
    /SYSTEM\s+"/gi,
    /PUBLIC\s+"/gi,

    // === COMMAND INJECTION ===
    /&&/g,
    /\|\|/g,
    /;/g,
    /\|/g,
    /`[^`]*`/g,
    /\$\([^)]*\)/g,
    /\$\{[^}]*\}/g,
    />\s*&/g,
    /<\s*&/g,
    /\bnc\s+-/gi,
    /\btelnet\s+/gi,
    /\bwget\s+/gi,
    /\bcurl\s+/gi,
    /\bchmod\s+/gi,
    /\bcat\s+/gi,
    /\bmore\s+/gi,
    /\bless\s+/gi,
    /\btail\s+/gi,
    /\bhead\s+/gi,
    /\bping\s+/gi,
    /\bnslookup\s+/gi,
    /\bdig\s+/gi,

    // === PATH TRAVERSAL ===
    /\.\.\//g,
    /\.\.%2f/gi,
    /\.\.%5c/gi,
    /\.\.%252f/gi,
    /\.\.\\+/g,
    /%2e%2e%2f/gi,
    /%2e%2e\//gi,
    /\.%2e\//gi,

    // === FILE OPERATIONS ===
    /\bfile_get_contents\s*\(/gi,
    /\bfile_put_contents\s*\(/gi,
    /\bfopen\s*\(/gi,
    /\bfwrite\s*\(/gi,
    /\bfread\s*\(/gi,
    /\breadfile\s*\(/gi,
    /\bfile\s*\(/gi,
    /\bunlink\s*\(/gi,
    /\brename\s*\(/gi,
    /\bcopy\s*\(/gi,
    /\bmkdir\s*\(/gi,
    /\brmdir\s*\(/gi,
    /\bscandir\s*\(/gi,
    /\bglob\s*\(/gi,
    /\bftp_/gi,
    /\bssh2_/gi,

    // === SERVER-SIDE INCLUDES ===
    /<!--#/gi,
    /<!--#exec/gi,
    /<!--#include/gi,

    // === TEMPLATE INJECTION ===
    /\{\{[^}]*\}\}/g,
    /\{%[^}]*%\}/g,
    /\$\{[^}]*\}/g,
    /\#\{[^}]*\}/g,
    /@\{[^}]*\}/g,

    // === NOSQL INJECTION ===
    /\$where/gi,
    /\$ne/gi,
    /\$gt/gi,
    /\$lt/gi,
    /\$regex/gi,
    /\$or\s*:/gi,
    /\$and\s*:/gi,

    // === DESERIALIZATION ===
    /\bunserialize\s*\(/gi,
    /\bObjectInputStream/gi,
    /\bPickle\.loads/gi,
    /\bYAML\.load/gi,

    // === PROTOCOL HANDLERS ===
    /file:\/\//gi,
    /ftp:\/\//gi,
    /gopher:\/\//gi,
    /dict:\/\//gi,
    /php:\/\//gi,
    /expect:\/\//gi,
    /zip:\/\//gi,
    /data:image/gi,
    /data:application/gi,

    // === REGEX DOS ===
    /\(\.\*\)\+/g,
    /\(\.\+\)\*/g,

    // === CRLF INJECTION ===
    /%0d%0a/gi,
    /%0D%0A/gi,
    /\\r\\n/gi,
    /\r\n/g,
    /\n\r/g,

    // === NULL BYTE ===
    /%00/gi,
    /\\x00/gi,
    /\\0/gi,

    // === UNICODE ATTACKS ===
    /%u/gi,
    /\\u00/gi,

    // === ENCODING ATTACKS ===
    /%3C/gi, // <
    /%3E/gi, // >
    /%22/gi, // "
    /%27/gi, // '
    /%28/gi, // (
    /%29/gi, // )
  ];

  // Check all patterns
  if (codeInjectionPatterns.some((pattern) => pattern.test(val))) {
    return false;
  }

  // ============================================
  // PHASE 2: BANNED KEYWORDS (case-insensitive)
  // ============================================
  const bannedKeywords = [
    "script",
    "iframe",
    "object",
    "embed",
    "applet",
    "link",
    "style",
    "form",
    "input",
    "button",
    "select",
    "textarea",
    "meta",
    "base",
    "img",
    "svg",
    "audio",
    "video",
    "source",
    "track",
    "canvas",
    "frame",
    "frameset",
    "noscript",
    "eval",
    "include",
    "require",
    "exec",
    "system",
    "passthru",
    "shell_exec",
    "alert",
    "confirm",
    "prompt",
    "document",
    "window",
    "location",
    "cookie",
    "fetch",
    "xmlhttprequest",
    "import",
    "export",
    "module",
    "process",
    "global",
    "__proto__",
    "constructor",
    "prototype",
    "function",
    "onclick",
    "onerror",
    "onload",
    "onmouseover",
    "onfocus",
    "onblur",
  ];

  for (const keyword of bannedKeywords) {
    if (
      lowerVal.includes(`<${keyword}`) ||
      lowerVal.includes(`</${keyword}`) ||
      lowerVal.includes(`${keyword}(`)
    ) {
      return false;
    }
  }

  // ============================================
  // PHASE 3: REMOVE ALLOWED TAGS ONLY
  // ============================================
  const cleaned = val
    .replace(/<p(\s+[^>]*)?>/gi, "")
    .replace(/<\/p>/gi, "")
    .replace(/<ul(\s+[^>]*)?>/gi, "")
    .replace(/<\/ul>/gi, "")
    .replace(/<ol(\s+[^>]*)?>/gi, "")
    .replace(/<\/ol>/gi, "")
    .replace(/<li(\s+[^>]*)?>/gi, "")
    .replace(/<\/li>/gi, "");

  // ============================================
  // PHASE 4: FINAL CHECK - NO HTML LEFT
  // ============================================
  if (cleaned.includes("<") || cleaned.includes(">")) {
    return false;
  }

  // Check for suspicious characters
  const suspiciousChars = ["{", "}", "$", "\\", "`", "|", "&", ";"];

  for (const char of suspiciousChars) {
    if (cleaned.includes(char)) {
      return false;
    }
  }

  return true;
};

export const AttorneyRequestSchema = z.object({
  clientType: z.enum(["client", "company"], {
    message: "نوع العميل مطلوب",
  }),
  clientId: z
    .string({
      message: "العميل مطلوب",
    })
    .min(1, "العميل مطلوب"),
  attorneyCapacity: z.enum(["اصالة عن نفسه", "محامي"], {
    message: "صفة المحامي مطلوبة",
  }),
  attorneyType: z
    .string({
      message: "نوع البند مطلوب",
    })
    .min(1, "نوع البند مطلوب"),
  attorneyDuration: z.enum(["3_months", "6_months", "9_months", "1_year"], {
    message: "مدة الوكالة مطلوبة",
  }),
  additionalNotes: z
    .string()
    .min(1, "الملاحظات مطلوبة")
    .refine(sanitizeRichText, { message: noScriptMessage }),
});

export type AttorneyRequestFields = z.infer<typeof AttorneyRequestSchema>;

export const AddAttorneySchema = z.object({
  attorneyNumber: z
    .string({
      message: "رقم الوكالة مطلوب",
    })
    .min(1, "رقم الوكالة مطلوب")
    .regex(/^\d+$/, numbersOnlyMessage),

  clientType: z.enum(["client", "company"], {
    message: "نوع العميل مطلوب",
  }),

  clientId: z
    .string({
      message: "العميل مطلوب",
    })
    .min(1, "العميل مطلوب"),

  attorneyPdf: z
    .object({
      file: z.instanceof(File),
      name: z.string().min(1, "اسم الملف مطلوب"),
      description: z.string().min(1, "وصف الملف مطلوب"),
    })
    .refine((data) => data.file.size <= 5000000, {
      message: "حجم الملف يجب أن يكون أقل من 5 ميجابايت",
      path: ["file"],
    })
    .refine((data) => data.file.type === "application/pdf", {
      message: "يجب أن يكون الملف بصيغة PDF",
      path: ["file"],
    })
    .optional()
    .nullable(),
});

export type AddAttorneyFields = z.infer<typeof AddAttorneySchema>;

export const AttorneyValidationSchema = z.object({
  attorneyNumber: z
    .string({
      message: "رقم الوكالة مطلوب",
    })
    .min(1, "رقم الوكالة مطلوب")
    .regex(/^\d+$/, numbersOnlyMessage),
});

export type AttorneyValidationFields = z.infer<typeof AttorneyValidationSchema>;

export const RevokeAttorneySchema = z.object({
  attorneyNumber: z
    .string({
      message: "رقم الوكالة مطلوب",
    })
    .min(1, "رقم الوكالة مطلوب")
    .regex(/^\d+$/, numbersOnlyMessage),

  rejectionReason: z
    .string({
      message: "سبب الإلغاء مطلوب",
    })
    .min(10, "يجب أن يكون سبب الإلغاء 10 أحرف على الأقل")
    .max(500, "يجب ألا يتجاوز سبب الإلغاء 500 حرف")
    .refine(sanitizeRichText, { message: noScriptMessage }),
});

export type RevokeAttorneyFields = z.infer<typeof RevokeAttorneySchema>;
