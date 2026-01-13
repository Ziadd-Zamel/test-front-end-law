/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CaseCategoryCount {
  categoryId: number;
  count: number;
  categoryName: string;
}

interface CategoryStatsChartProps {
  caseCountData: CaseCategoryCount[];
}

const chartConfig = {
  count: {
    label: "Cases",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const CategoryStatsChart: React.FC<CategoryStatsChartProps> = ({
  caseCountData,
}) => {
  const top10Data = caseCountData.slice(0, 10).map((item) => ({
    ...item,
    count: item.count === 0 ? 0.5 : item.count,
  }));

  const totalCases = caseCountData.reduce((sum, item) => sum + item.count, 0);
  const top10Total = top10Data.reduce(
    (sum, item) => sum + (item.count === 0.5 ? 0 : item.count),
    0
  );
  const percentage = ((top10Total / totalCases) * 100).toFixed(1);

  const CustomLabel = (props: any) => {
    const { x, y, width, value } = props;
    const displayValue = value === 0.5 ? 0 : value;

    return (
      <text
        x={x + width / 2}
        y={y - 8}
        fill="#374151"
        textAnchor="middle"
        fontSize={12}
        fontWeight="600"
      >
        {displayValue}
      </text>
    );
  };

  return (
    <Card className="w-full h-[500px] flex flex-col rounded-lg">
      <CardHeader>
        <CardTitle>أكثر 10 فئات من حيث عدد القضايا</CardTitle>
        <div className="flex gap-6 mt-2 text-sm text-muted-foreground">
          <div>
            <span className="font-semibold text-foreground">{top10Total}</span>{" "}
            قضية في أعلى 10 فئات
          </div>
          <div>
            <span className="font-semibold text-foreground">{percentage}%</span>{" "}
            من إجمالي القضايا
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            accessibilityLayer
            data={top10Data}
            barCategoryGap="0%"
            maxBarSize={40}
            margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="categoryName"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 15)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toString()}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="#3b82f6" radius={4} barSize={40}>
              <LabelList content={<CustomLabel />} position="top" />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CategoryStatsChart;
