"use client";

// The Hazard dashboard's thin ECharts mount (init, setOption on change, resize-observed, event bindings through a
// ref), with tree-shaken imports: only the line and scatter charts and the components the curve plot uses are
// bundled, which keeps the cell page inside its speed budget (06 §2.9). Colours come from the page's tokens, so
// no ECharts theme is used; the chart re-initialises when the theme flips.
import type { EChartsOption } from "echarts";
import { LineChart, ScatterChart } from "echarts/charts";
import { GridComponent, MarkAreaComponent, MarkLineComponent, MarkPointComponent, TooltipComponent } from "echarts/components";
import { init, use as registerEcharts, type ECharts } from "echarts/core";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

registerEcharts([LineChart, ScatterChart, GridComponent, MarkAreaComponent, MarkLineComponent, MarkPointComponent, TooltipComponent, LabelLayout, CanvasRenderer]);

export function EChart({ option, className = "", onEvents, ariaLabel }: { option: EChartsOption; className?: string; onEvents?: Record<string, (e: unknown) => void>; ariaLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const chart = useRef<ECharts | null>(null);
  const eventsRef = useRef(onEvents);
  const optionRef = useRef(option);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    eventsRef.current = onEvents;
  }, [onEvents]);

  useEffect(() => {
    if (!ref.current) return;
    chart.current?.dispose();
    chart.current = init(ref.current, undefined, { renderer: "canvas" });
    chart.current.setOption({ backgroundColor: "transparent", ...optionRef.current });
    for (const name of Object.keys(eventsRef.current ?? {})) {
      chart.current.on(name, (e: unknown) => eventsRef.current?.[name]?.(e));
    }
    const ro = new ResizeObserver(() => chart.current?.resize());
    ro.observe(ref.current);
    return () => {
      ro.disconnect();
      chart.current?.dispose();
      chart.current = null;
    };
  }, [resolvedTheme]);

  useEffect(() => {
    optionRef.current = option;
    chart.current?.setOption({ backgroundColor: "transparent", ...option }, { notMerge: true });
  }, [option]);

  return <div ref={ref} className={className} role="img" aria-label={ariaLabel} />;
}
