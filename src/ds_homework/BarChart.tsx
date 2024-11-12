import React, { useEffect, useMemo, useState } from "react"
import { EchartsAdapter } from "./EchartsAdapter";
import { useMyFiltersService } from "../services";
import { getKoobDataByCfg } from "./utils";
const BarChart = (props) => {
    const { filtersModel, filtersService } = useMyFiltersService();
    const { cfg } = props;
    const { dataSource } = cfg;
    const [data, setData] = useState([]);
    const measures = useMemo(() =>
        dataSource.measures.map((measure) => {
            const splitedMeasure = measure.split(':')
            return splitedMeasure[1] || splitedMeasure[0];
        }), [dataSource.measures])
    const dimensions = useMemo(() =>
        dataSource.dimensions.map((dimension) => {
            const spliteddimension = dimension.split(':')
            return spliteddimension[1] || spliteddimension[0];
        }), [dataSource.dimensions])
    useEffect(() => {
        getKoobDataByCfg(
            null,
            {
                ...dataSource,
                columns: [...dataSource.dimensions, ...dataSource.measures],
                filters: Object.entries(dataSource.filters || {}).reduce(
                    (acc, [key, value]) => {

                        if (value === true) {
                            if (filtersModel.filters[key]?.length > 1)
                                acc[key] = filtersModel.filters[key];
                        }
                        else if (value) {
                            acc[key] = value;
                        }
                        return acc;
                    }, {}
                ),
                
            },
            setData,
            'barChart'
        )
    }, [dataSource, filtersModel])

    const axisData = data.reduce((acc, datum) => {
        if (!acc[datum[dimensions[0]]]) {
            acc[datum[dimensions[0]]] = Object.keys(acc).length;
        }
        return acc;
    }, {});
    const axisDataKeys = Object.keys(axisData);
    const stack = dimensions[1] ?? Object.keys(data.reduce((acc, datum) => {
        acc[datum[dimensions[0]]] = true;
        return acc;
    }, {}));
    const series = Object.entries(data.reduce((acc, datum) => {
        measures.forEach((measure) => {
            const key = `${measure}; ${datum[dimensions[1]] || ''}`;
            if (!acc[key]) {
                acc[key] = new Array(axisDataKeys.length);
            }
            acc[key][axisData[datum[dimensions[0]]]] = datum[measure];
        })
        return acc;
    }, {})
    ).reduce((acc, [key, value]) => {
        const [stack, name] = key.split('; ');
        acc.push({
            data: value,
            type: 'bar',
            stack,
            name: name || stack
        },)
        return acc;
    }, [])
    const option = {
        legend: {
            type: 'scroll',
            orient: 'horizontal',
            show: true,
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            top: '35px',
            bottom: 0,
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: axisDataKeys,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series
    };
    return (
        <div style={{ width: '100%', height: '100%' }
        }>
            <EchartsAdapter option={option} settings={true} />
        </div >
    )
}
export default BarChart;