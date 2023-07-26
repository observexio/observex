import { TimeRange } from "types/time";
import {cloneDeep, random, round} from 'lodash'
import { calculateInterval } from "utils/datetime/range";
import { DatasourceMaxDataPoints, DatasourceMinInterval } from "src/data/constants";
import { PanelDatasource } from "types/dashboard";

const rawData = {
    "status": "success",
    "data": {
        "resultType": "matrix",
        "result": [
            {
                "metric": {
                    "cpu": "user",
                    "instance": "localhost:9100",
                },
                "values": [
                ]
            },
            {
                "metric": {
                    "cpu": "user",
                    "instance": "localhost:9101",
                },
                "values": [
                ]
            },
            {
                "metric": {
                    "cpu": "user",
                    "instance": "localhost:9102",
                },
                "values": [
                    
                ]
            },
            // {
            //     "metric": {
            //         "cpu": "0",
            //         "instance": "localhost:9100",
            //         "job": "node",
            //         "mode": "user"
            //     },
            //     "values": [
            //     ]
            // },
            // {
            //     "metric": {
            //         "cpu": "1",
            //         "instance": "localhost:9100",
            //         "job": "node",
            //         "mode": "idle"
            //     },
            //     "values": [
            //     ]
            // },
            // {
            //     "metric": {
            //         "cpu": "1",
            //         "instance": "localhost:9100",
            //         "job": "node",
            //         "mode": "nice"
            //     },
            //     "values": [
            //     ]
            // }
        ]
    }
}

export const genPrometheusData = (timeRange: TimeRange,ds: PanelDatasource) => {
    const data = cloneDeep(rawData)
    const start = timeRange.start.getTime() / 1000 
    const end = timeRange.end.getTime() / 1000 
    const interval = calculateInterval(timeRange,  ds.queryOptions.maxDataPoints?? DatasourceMaxDataPoints,ds.queryOptions.minInterval??DatasourceMinInterval).intervalMs / 1000
    const timeBucks = []
    let current = start;
    while (current <= end) {
        timeBucks.push(current)
        current += interval        
    }

   for (const r of data.data.result) {
        const max = random(0, 10, true)
        for (const t of timeBucks) {
            r.values.push([round(t), random(0, max, true)])
        }
   }

   return data.data
}   