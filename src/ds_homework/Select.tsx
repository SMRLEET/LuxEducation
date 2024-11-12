import React from "react";
import { useEffect, useMemo, useState } from "react";

import { useMyFiltersService } from "../services";
import { getKoobDataByCfg } from "./utils";

const Select = (props) => {

    const { cfg } = props;
    const { dataSource } = cfg;
    const [data, setData] = useState([]);
    const dim: string = useMemo(() => {
        const splitedDim = dataSource.dimensions?.[0].split(":");
        return splitedDim[1] || splitedDim[0]
    }, [dataSource.dimensions]);
    const { filtersModel, filtersService } = useMyFiltersService();
    const selectedFilters = useMemo(() => {
        return (filtersModel.filters[dim])?.slice(1, filtersModel.filters[dim]?.length) || []
    }, [filtersModel.filters[dim]])
    useEffect(() => {
        getKoobDataByCfg(
            null,
            {
                ...dataSource,
                columns: dataSource.dimensions,
                filters: {},
                distinct: [dim],
            },
            setData,
            'select'
        )
    }, [dataSource, dim])

    const filtersMap = useMemo(() => {
        return selectedFilters.reduce((acc, filter) => {
            acc[String(filter)] = true;
            return acc;
        }, {})
    }, [filtersModel.filters?.[dim]])
    return <div style={{ position: 'relative', height: '100%', padding: '1rem' }}>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '0.5rem',
            marginBottom: '0.4rem',
            alignItems: 'center',
            textAlign: 'center'
        }}>
            <div style={{
                height: '2rem',
                width: 'calc(100% - 6rem)',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                border: 'solid 1px black',
                textOverflow: 'ellipsis',
                display: "flex",
                alignItems: 'center'
            }}>
                {selectedFilters?.join(', ')}
            </div>
            <div style={{ cursor: 'pointer' }}
                onClick={() => {
                    filtersService.setFilter(dim, [])
                }}
            >
                Сбросить
            </div>
        </div>
        <div style={{
            maxHeight: 'calc(100% - 2rem)',
            height: 'fit-content',
            width: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',

        }}>
            {data.map(datum => {
                const value = datum[dim];
                const selected = filtersMap?.[String(value)];
                return (
                    <div
                        key={`${value}`}
                        style={{
                            cursor: 'pointer',
                            backgroundColor:
                                selected ? 'yellow' : 'transparent'
                        }}
                        onClick={() => {
                            if (filtersMap?.[String(value)]) {
                                filtersService.setFilter(dim, ['=', ...selectedFilters.filter((filter) => filter != value)])
                            }
                            else
                                filtersService.setFilter(dim, ["=", ...selectedFilters, value])
                        }}
                    >
                        {datum[dim]}
                    </div>
                )
            })}
        </div>

    </div>
}
export default Select;