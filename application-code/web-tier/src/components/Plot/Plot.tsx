import { useTheme, useMediaQuery, Box, ToggleButton, FormControlLabel, Switch, Stack, ToggleButtonGroup, Theme } from '@mui/material';

import { useEffect, useRef, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { PlotSeries } from 'src/models/seriesPlot';

type ChartType = "area" | "line" | "bar" | "histogram" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "candlestick" | "boxPlot" | "radar" | "polarArea" | "rangeBar" | "treemap";
interface PlotConfig {
    showDataLabels: boolean;
    type: ChartType;
    xLabelType: string;
    metric: string;
    stacked?: boolean,
    horizontal?: boolean;
    showMarker?: boolean;
}
interface Props {
  height: number;
  plotConfig: PlotConfig;
  series: PlotSeries[];
}

function Plot({
    height,
    plotConfig,
    series
}: Props) {
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('md'));
    const [localSeriesData, setLocalSeriesData] = useState([]);
    const [plotOptions, setPlotOptions] = useState(null);
    const yAxisLabel = useRef(null);
    const [selectedMetric, setSelectedMetric] = useState(plotConfig.metric || null);
    // console.log(series);
    useEffect(() => {
        setPlotOptions({ config: createPlotOptions(theme, selectedMetric, plotConfig.type, plotConfig.xLabelType) });
    },[theme, plotConfig]);

    useEffect(() => {     
        setLocalSeriesData(series);  
    }, [series])

    const createPlotOptions = (theme: Theme, selectedMetric, type, xLabelType) => {
        yAxisLabel.current = selectedMetric;
        return {
            chart: {
                foreColor: theme.colors.alpha.trueWhite[70],
                type: type,
                stacked: plotConfig.stacked,
                toolbar: {
                    show: false,
                    offsetX: 0,
                    offsetY: 0,
                    tools: {
                      download: false,
                      selection: false,
                      zoom: false,
                      zoomin: false,
                      zoomout: false,
                      pan: false,
                      reset: false 
                    //   | '<img src="/static/icons/reset.png" width="20">',
                    //   customIcons: []
                    }
                }
            },
            legend: {
                position: 'top',
                offsetY: 14
            },
            colors: [
                theme.colors.success.main,
                theme.colors.error.main,
                theme.colors.warning.main,
                theme.colors.primary.main,
                theme.colors.secondary.main,
                theme.colors.info.main,
                theme.colors.alpha.white[100],
                theme.colors.alpha.trueWhite[100],
                theme.colors.alpha.black[100],
                theme.colors.gradients.blue5,
                theme.colors.gradients.orange2
            ],
            grid: {
                show: false,
            },
            plotOptions: {
                bar: {
                    horizontal: Boolean(plotConfig.horizontal),
                    dataLabels: {
                      orientation: 'horizontal',
                      position: 'top' // bottom/center/top
                    }
                }
            },
            markers: {
                size: Boolean(plotConfig.showMarker) ? 5 : 0
            //     colors: undefined,
            //     strokeColors: '#fff',
            //     strokeWidth: 2,
            //     strokeOpacity: 0.9,
            //     strokeDashArray: 0,
            //     fillOpacity: 1,
            //     discrete: [],
            //     shape: "circle",
            //     radius: 2,
            //     offsetX: 0,
            //     offsetY: 0,
            //     onClick: undefined,
            //     onDblClick: undefined,
            //     showNullDataPoints: true,
            //     hover: {
            //       size: undefined,
            //       sizeOffset: 3
            //     }
            },
            dataLabels: {
                enabled: plotConfig.showDataLabels,
            },
            stroke: {
                curve: 'smooth',
                width: 2,
                // dashArray: [0, 8]
            },
            xaxis: {
                type: xLabelType
            },
            yaxis: {
                labels: {
                    formatter: function(value, opt) {
                        if (!isNaN(value)) {
                            if (yAxisLabel.current) {
                                return value.toFixed(1) + " " + yAxisLabel.current?.toUpperCase();
                            } else if (Number(value)){
                                return value.toFixed(1);
                            }
                        } else {
                            return value;
                        }
                    }
                }
            },
            tooltip: {
                theme: 'dark',
                shared: Boolean(plotConfig.showMarker) ? false : true,
                intersect: Boolean(plotConfig.showMarker) ? true : false,
                x: {
                    format: 'MMM dd, yyyy'
                },
            },
        } as ApexOptions
    }

    if (localSeriesData.length === 0 || !plotOptions) return null

    return (
        <Box sx={{ position: "relative" }}>
            <ReactApexChart options={plotOptions.config} series={localSeriesData} type={plotConfig.type} height={height} />
        </Box>
    );
}

export default Plot;
