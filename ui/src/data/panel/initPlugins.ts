import { PanelType } from "types/dashboard";
import { PanelPlugins } from "types/panel/plugins";

export const onClickCommonEvent= "// setVariable: (varName:string, varValue:string) => void \nfunction onClick(item, router, setVariable) {\n\tconsole.log(item)\n}"

//@needs-update-when-add-new-panel
export const initPanelPlugins: PanelPlugins = {
    [PanelType.Graph]: {
        tooltip: {
            mode: 'all',
            sort: 'desc'
        },
        legend: {
            mode: "table",
            placement: "bottom"
        },
        styles: {
            style: "lines",
            lineWidth: 2,
            fillOpacity: 21,
            showPoints: "never",
            pointSize: 5,
            gradientMode: "opacity"
        },
        axis: {
            showGrid: true,
            scale: "linear",
            scaleBase: 2
        },
        std: {
            unitsType: 'none',
            units: [],
            decimals: 3
        }
    },

    [PanelType.Text]:  {
        disableDatasource: true,
        md: `#Welcome to Starship\n This is a new panel\n You can edit it by clicking the edit button on the top title\n ###Have fun!`,
        justifyContent: "left",
        alignItems: "top",
        fontSize: '1.2rem',
        fontWeight: '500',
    },

    [PanelType.Table]: {
        showHeader: true,
        globalSearch:false,
        enablePagination:false,
        pageSize: 10,
        enableFilter: true,
        enableSort: true,
        onRowClick: onClickCommonEvent
    },

    [PanelType.NodeGraph]: {
        node: {
            baseSize: 36,
            maxSize: 1.5,
            icon: [],
            shape: "donut",
            donutColors: JSON.stringify({
                'success': '#61DDAA',
                'error': '#F08BB4',
            }),
            tooltipTrigger: 'mouseenter',
            menu: []
        },

        edge: {
            shape: 'quadratic',
            arrow: 'default',
            color: {
                light: '#ddd', 
                dark: "#8CA88C",
            },
            opacity: 0.6,
            highlightColor: {
                light: '#E0D731',
                dark: '#00B5D8'
            }
        },

        legend: {
            enable: true
        },

        layout: {
            nodeStrength: 5000,
            gravity: 60,
        }
    },

    [PanelType.Echarts]: {
        setOptionsFunc: `// setOptions return echarts.Options, it is directly passed to a echarts chart.
// Find more options examples: https://echarts.apache.org/examples/en/index.html#chart-type-line
function setOptions(data) {
    console.log(data)
    // I guess you are using testdata datasource,
    // data fetching from testdata is already an echarts option
    // so there is no need to parse it
    const options = {...data[0]}
    
    //!!!ATTENTION!!!
    //options returns here must be a new object to trigger react update!
    return options
}`,
        registerEventsFunc: `// In registerEvents, you can custom events on your chart, e.g mouse click event, mouse over event etc.
// chart: a instance of echarts, you can call echarts apis on it
// options: result of setOptions function
// Find more examples: https://echarts.apache.org/en/api.html#events
function registerEvents(options, chart) {
    // !!!!!!!ATTENTION! You must unbind event handler first! 
    // Because each time the options changeds registerEvents function will be called once
    // If we don't unbind event, next time you click the chart will trigger N  click event ( N = Number of times the options changes)
    // Rather than unbind all 'click' events, you can also unbind an specific handler: https://echarts.apache.org/en/api.html#echartsInstance.off
    chart.off('click') 
    chart.on('click', function (params) {
        console.log(params)
    })
}`
    }
}


