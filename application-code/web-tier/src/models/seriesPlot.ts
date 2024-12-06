import { MovieEntry } from "./movieEntry"

export interface PlotSeries {
    name: string,
    data: PlotData[]
}

export interface PlotData {
    x: Date,//Date
    y: number //
}
