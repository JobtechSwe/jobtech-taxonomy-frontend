import React from 'react';
import {ResponsiveTreeMap} from '@nivo/treemap';
import {ResponsiveBar} from '@nivo/bar';
import {ResponsivePie} from '@nivo/pie';
import Label from '../../control/label.jsx';
import Group from '../../control/group.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';

class Content5 extends React.Component { 

    constructor() {
        super();
        //Storleken på värdeförråd mot varandra (hämta några olika)

        this.data = {            
              "name": "nivo",
              "color": "hsl(21, 70%, 50%)",
              "children": [
                {
                  "name": "viz",
                  "color": "hsl(92, 70%, 50%)",
                  "children": [
                    {
                      "name": "stack",
                      "color": "hsl(6, 70%, 50%)",
                      "children": [
                        {
                          "name": "chart",
                          "color": "hsl(329, 70%, 50%)",
                          "loc": 129891
                        },
                        {
                          "name": "xAxis",
                          "color": "hsl(347, 70%, 50%)",
                          "loc": 138722
                        },
                        {
                          "name": "yAxis",
                          "color": "hsl(4, 70%, 50%)",
                          "loc": 68988
                        },
                        {
                          "name": "layers",
                          "color": "hsl(150, 70%, 50%)",
                          "loc": 45955
                        }
                      ]
                    },
                    {
                      "name": "pie",
                      "color": "hsl(115, 70%, 50%)",
                      "children": [
                        {
                          "name": "chart",
                          "color": "hsl(169, 70%, 50%)",
                          "children": [
                            {
                              "name": "pie",
                              "color": "hsl(250, 70%, 50%)",
                              "children": [
                                {
                                  "name": "outline",
                                  "color": "hsl(56, 70%, 50%)",
                                  "loc": 158699
                                },
                                {
                                  "name": "slices",
                                  "color": "hsl(83, 70%, 50%)",
                                  "loc": 112843
                                },
                                {
                                  "name": "bbox",
                                  "color": "hsl(93, 70%, 50%)",
                                  "loc": 16875
                                }
                              ]
                            },
                            {
                              "name": "donut",
                              "color": "hsl(302, 70%, 50%)",
                              "loc": 116918
                            },
                            {
                              "name": "gauge",
                              "color": "hsl(236, 70%, 50%)",
                              "loc": 189608
                            }
                          ]
                        },
                        {
                          "name": "legends",
                          "color": "hsl(179, 70%, 50%)",
                          "loc": 119304
                        }
                      ]
                    }
                  ]
                },
                {
                  "name": "colors",
                  "color": "hsl(9, 70%, 50%)",
                  "children": [
                    {
                      "name": "rgb",
                      "color": "hsl(190, 70%, 50%)",
                      "loc": 38088
                    },
                    {
                      "name": "hsl",
                      "color": "hsl(36, 70%, 50%)",
                      "loc": 198583
                    }
                  ]
                },
                {
                  "name": "utils",
                  "color": "hsl(356, 70%, 50%)",
                  "children": [
                    {
                      "name": "randomize",
                      "color": "hsl(272, 70%, 50%)",
                      "loc": 41181
                    },
                    {
                      "name": "resetClock",
                      "color": "hsl(278, 70%, 50%)",
                      "loc": 82657
                    },
                    {
                      "name": "noop",
                      "color": "hsl(226, 70%, 50%)",
                      "loc": 49040
                    },
                    {
                      "name": "tick",
                      "color": "hsl(68, 70%, 50%)",
                      "loc": 62514
                    },
                    {
                      "name": "forceGC",
                      "color": "hsl(59, 70%, 50%)",
                      "loc": 115854
                    },
                    {
                      "name": "stackTrace",
                      "color": "hsl(294, 70%, 50%)",
                      "loc": 72639
                    },
                    {
                      "name": "dbg",
                      "color": "hsl(313, 70%, 50%)",
                      "loc": 86858
                    }
                  ]
                },
                {
                  "name": "generators",
                  "color": "hsl(266, 70%, 50%)",
                  "children": [
                    {
                      "name": "address",
                      "color": "hsl(121, 70%, 50%)",
                      "loc": 119620
                    },
                    {
                      "name": "city",
                      "color": "hsl(121, 70%, 50%)",
                      "loc": 187067
                    },
                    {
                      "name": "animal",
                      "color": "hsl(141, 70%, 50%)",
                      "loc": 132571
                    },
                    {
                      "name": "movie",
                      "color": "hsl(259, 70%, 50%)",
                      "loc": 59522
                    },
                    {
                      "name": "user",
                      "color": "hsl(282, 70%, 50%)",
                      "loc": 198097
                    }
                  ]
                },
                {
                  "name": "set",
                  "color": "hsl(265, 70%, 50%)",
                  "children": [
                    {
                      "name": "clone",
                      "color": "hsl(61, 70%, 50%)",
                      "loc": 191526
                    },
                    {
                      "name": "intersect",
                      "color": "hsl(314, 70%, 50%)",
                      "loc": 196854
                    },
                    {
                      "name": "merge",
                      "color": "hsl(341, 70%, 50%)",
                      "loc": 142621
                    },
                    {
                      "name": "reverse",
                      "color": "hsl(116, 70%, 50%)",
                      "loc": 8525
                    },
                    {
                      "name": "toArray",
                      "color": "hsl(116, 70%, 50%)",
                      "loc": 138545
                    },
                    {
                      "name": "toObject",
                      "color": "hsl(107, 70%, 50%)",
                      "loc": 74054
                    },
                    {
                      "name": "fromCSV",
                      "color": "hsl(319, 70%, 50%)",
                      "loc": 75134
                    },
                    {
                      "name": "slice",
                      "color": "hsl(258, 70%, 50%)",
                      "loc": 59390
                    },
                    {
                      "name": "append",
                      "color": "hsl(113, 70%, 50%)",
                      "loc": 136179
                    },
                    {
                      "name": "prepend",
                      "color": "hsl(131, 70%, 50%)",
                      "loc": 18692
                    },
                    {
                      "name": "shuffle",
                      "color": "hsl(3, 70%, 50%)",
                      "loc": 54440
                    },
                    {
                      "name": "pick",
                      "color": "hsl(331, 70%, 50%)",
                      "loc": 64207
                    },
                    {
                      "name": "plouc",
                      "color": "hsl(355, 70%, 50%)",
                      "loc": 92640
                    }
                  ]
                },
                {
                  "name": "text",
                  "color": "hsl(123, 70%, 50%)",
                  "children": [
                    {
                      "name": "trim",
                      "color": "hsl(327, 70%, 50%)",
                      "loc": 159774
                    },
                    {
                      "name": "slugify",
                      "color": "hsl(320, 70%, 50%)",
                      "loc": 84141
                    },
                    {
                      "name": "snakeCase",
                      "color": "hsl(207, 70%, 50%)",
                      "loc": 152021
                    },
                    {
                      "name": "camelCase",
                      "color": "hsl(358, 70%, 50%)",
                      "loc": 154650
                    },
                    {
                      "name": "repeat",
                      "color": "hsl(328, 70%, 50%)",
                      "loc": 81080
                    },
                    {
                      "name": "padLeft",
                      "color": "hsl(346, 70%, 50%)",
                      "loc": 143083
                    },
                    {
                      "name": "padRight",
                      "color": "hsl(232, 70%, 50%)",
                      "loc": 190785
                    },
                    {
                      "name": "sanitize",
                      "color": "hsl(223, 70%, 50%)",
                      "loc": 23716
                    },
                    {
                      "name": "ploucify",
                      "color": "hsl(21, 70%, 50%)",
                      "loc": 73846
                    }
                  ]
                },
                {
                  "name": "misc",
                  "color": "hsl(330, 70%, 50%)",
                  "children": [
                    {
                      "name": "whatever",
                      "color": "hsl(168, 70%, 50%)",
                      "children": [
                        {
                          "name": "hey",
                          "color": "hsl(227, 70%, 50%)",
                          "loc": 124580
                        },
                        {
                          "name": "WTF",
                          "color": "hsl(147, 70%, 50%)",
                          "loc": 159849
                        },
                        {
                          "name": "lol",
                          "color": "hsl(62, 70%, 50%)",
                          "loc": 148884
                        },
                        {
                          "name": "IMHO",
                          "color": "hsl(246, 70%, 50%)",
                          "loc": 66041
                        }
                      ]
                    },
                    {
                      "name": "other",
                      "color": "hsl(109, 70%, 50%)",
                      "loc": 148948
                    },
                    {
                      "name": "crap",
                      "color": "hsl(226, 70%, 50%)",
                      "children": [
                        {
                          "name": "crapA",
                          "color": "hsl(76, 70%, 50%)",
                          "loc": 129048
                        },
                        {
                          "name": "crapB",
                          "color": "hsl(240, 70%, 50%)",
                          "children": [
                            {
                              "name": "crapB1",
                              "color": "hsl(92, 70%, 50%)",
                              "loc": 123446
                            },
                            {
                              "name": "crapB2",
                              "color": "hsl(60, 70%, 50%)",
                              "loc": 27958
                            },
                            {
                              "name": "crapB3",
                              "color": "hsl(260, 70%, 50%)",
                              "loc": 110685
                            },
                            {
                              "name": "crapB4",
                              "color": "hsl(189, 70%, 50%)",
                              "loc": 196906
                            }
                          ]
                        },
                        {
                          "name": "crapC",
                          "color": "hsl(331, 70%, 50%)",
                          "children": [
                            {
                              "name": "crapC1",
                              "color": "hsl(256, 70%, 50%)",
                              "loc": 58545
                            },
                            {
                              "name": "crapC2",
                              "color": "hsl(218, 70%, 50%)",
                              "loc": 90651
                            },
                            {
                              "name": "crapC3",
                              "color": "hsl(186, 70%, 50%)",
                              "loc": 56119
                            },
                            {
                              "name": "crapC4",
                              "color": "hsl(290, 70%, 50%)",
                              "loc": 61936
                            },
                            {
                              "name": "crapC5",
                              "color": "hsl(128, 70%, 50%)",
                              "loc": 49317
                            },
                            {
                              "name": "crapC6",
                              "color": "hsl(298, 70%, 50%)",
                              "loc": 194176
                            },
                            {
                              "name": "crapC7",
                              "color": "hsl(293, 70%, 50%)",
                              "loc": 108268
                            },
                            {
                              "name": "crapC8",
                              "color": "hsl(39, 70%, 50%)",
                              "loc": 155259
                            },
                            {
                              "name": "crapC9",
                              "color": "hsl(32, 70%, 50%)",
                              "loc": 12652
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
        };
        this.data2 = [
            {
                id: "a",
                key1: 5,
                key2: 10,
                key3: 7,
            },
            {
                id: "b",
                key1: -5,
                key2: 40,
                key3: 8,
            },
            {
                id: "c",
                key1: 15,
                key2: -10,
                key3: 9,
            },
        ];
    this.data3 = [
        {
            id: "a",
            label: "aaa",
            value: 10,
            color: "#777",
        },
        {
            id: "b",
            label: "bbb",
            value: 40,
            color: "#888",
        },
        {
            id: "c",
            label: "ccc",
            value: 15,
            color: "#999",
        },
    ];
}

    render() {
        return (
            <div className="main_content_5">
                <ResponsiveTreeMap
                    root={this.data}
                    identity="name"
                    value="loc"
                    label="loc"                    
                />
                <ResponsiveBar 
                    data={this.data2}
                    keys={["key1", "key2", "key3"]}
                    indexBy="id"                    
                />
                <ResponsivePie 
                    data={this.data3}
                />
            </div>
        );
    }
	
}

export default Content5;