import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';
import type { CSSProperties } from 'react';
import { forceResizeCharts } from './utils';


interface IOnEvents {
    type: string;
    func: Function;
}

export interface ReactEChartsProps {
    option: echarts.EChartsOption;
    onEvents?: IOnEvents;
    style?: CSSProperties;
    settings?: echarts.SetOptionOpts;
    loading?: boolean;
    theme?: 'light' | 'dark';
    forceResize?: boolean;
}

export function EchartsAdapter({
    option,
    onEvents,
    style,
    settings = true,
    loading,
    theme,
    forceResize = true,
}: ReactEChartsProps): JSX.Element {
    const chartRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let chart: echarts.ECharts | undefined;
        if (chartRef.current !== null) {
            chart = echarts.init(chartRef.current, theme);
        }
        function resizeChart() {
            chart?.resize(null, null);
        }
        let observer: ResizeObserver | false | undefined = false;
        if (forceResize) observer = forceResizeCharts(resizeChart, chartRef.current);
        return () => {
            chart?.dispose();
        };
    }, [theme, chartRef.current]);
    useEffect(() => {
        if (chartRef.current !== null) {
            const chart = echarts.getInstanceByDom(chartRef.current);
            chart?.setOption(option, settings);
            chart?.on(onEvents?.type, function (params: any) {
                onEvents?.func(params);
                chart?.setOption(option, settings);
            });
        }
    }, [option, settings, onEvents, theme]); 
    useEffect(() => {
 
        if (chartRef.current !== null) {
            const chart = echarts.getInstanceByDom(chartRef.current);

            loading === true ? chart?.showLoading() : chart?.hideLoading();
        }
    }, [loading, theme]);

    return (
        <div ref={chartRef} style={{ width: '100%', height: '100%', ...style }} />
    );
}

interface ISeries {
    name: string;
    data: number[];
}

export interface ILegendselectchangedParams {
    name: string;
    selected: Record<string, boolean>;
    type: string;
}

export function sum(series: ISeries[], array: number[]) {
    let result = 0;

    for (let z = 0; z < series[0]?.data.length; z++) {
        for (let i = 0; i < series.length; i++) {
            result += series[i].data[z];
        }

        array.push(result);
        result = 0;
    }
}

export function sumForEvents(
    series: ISeries[],
    array: number[],
    params: ILegendselectchangedParams
) {
    let result = 0;

    for (let z = 0; z < series[0]?.data.length; z++) {
        for (let i = 0; i < series.length; i++) {
            if (params.selected[series[i].name]) result += series[i].data[z];
        }
        array.push(result);
        result = 0;
    }
}