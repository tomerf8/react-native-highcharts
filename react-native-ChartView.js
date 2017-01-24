import React, { Component, PropTypes, } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  WebView,
  Image,
  Dimensions
} from 'react-native';

const win = Dimensions.get('window');
const Highcharts='Highcharts';

class ChartWeb extends Component {

    constructor(props){
        super(props);
        this.state={
            init:`<html>
                    <style media="screen" type="text/css">
                    #container {
                        width:100%;
                        height:100%;
                        top:0;
                        left:0;
                        right:0;
                        bottom:0;
                        position:absolute;
                    }
                    </style>
                    <head>
                        <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
                        <script src="http://code.highcharts.com/stock/highstock.js"></script>
                        <script>
                        $(function () {
                            Highcharts.stockChart('container', `,
            end:`           );
                        });
                        </script>
                    </head>
                    <body>
                        <div id="container">
                        </div>
                    </body>
                </html>`,
            Wlayout:{
                height:win.height,
                width:win.width
            }
        }
    }

    re_renderWebView(e) {//re_render is used to resize on orientation of display
        this.setState({
            Wlayout: {
                height: e.nativeEvent.layout.height,
                width: e.nativeEvent.layout.width,
            }
        })
    }

    render() {
        var config = JSON.stringify(this.props.config, function (key, value) {//create string of json but if it detects function it uses toString()
            return (typeof value === 'function') ? value.toString() : value;
        });

        config = config.replace(/\\n/g, " ");//remove \n in string = ""
        config = config.replace(/\"([^(\")"]+)\":/g, "$1: ");//remove {"chart":"chart"} = {chart:"chart"}
        config = config.replace(/\"function/g, "function");//remove {chart:"function ...} = {chart:function ...}
        config = config.replace(/}\"/g, "}");//remove {chart:function(){}"} = {chart:function(){}} 
        var concatHTML = this.state.init + config + this.state.end;
        return (
            <View style={this.props.style}>
                <WebView
                    onLayout={this.re_renderWebView}
                    style={styles.full}
                    source={{ html: concatHTML, baseUrl: 'web/' }}
                    javaScriptEnabled={true}
                />
            </View>
        );
    };
};

var styles = StyleSheet.create({
    full: {
        flex: 1,
    }
});

module.exports = ChartWeb;
