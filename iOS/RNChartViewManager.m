//
//  RNChartViewManager.m
//  RNChart
//
//  Created by Hyun Cho on 4/20/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "RNChartViewManager.h"
#import "RNChartView.h"
#import "RCTBridge.h"
#import "RCTConvert.h"

@interface RNChartViewManager ()

@end


@implementation RNChartViewManager

RCT_EXPORT_MODULE()

- (RCTView *)view
{
  RNChartView* chartView = [[RNChartView alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
  return chartView;
}

RCT_EXPORT_VIEW_PROPERTY(chartData, NSDictionaryArray)
RCT_EXPORT_VIEW_PROPERTY(verticalGridStep, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(xLabels, NSStringArray)
RCT_EXPORT_VIEW_PROPERTY(showGrid, BOOL)
RCT_EXPORT_VIEW_PROPERTY(gridColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(gridLineWidth, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(animationDuration, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(margin, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(showAxis, BOOL)
RCT_EXPORT_VIEW_PROPERTY(axisColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(axisLineWidth, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(labelTextColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(labelFontSize, CGFloat)

@end
