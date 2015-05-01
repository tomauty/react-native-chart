//
//  RNChartPlotAreaView.h
//  RNChart
//
//  Created by Hyun Cho on 4/30/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@class RNChartView;

@interface RNChartPlotAreaView : UIView

- (id)initWithParentView:(RNChartView*)parentChartView;
- (void)drawCharts;

@property (nonatomic, weak) RNChartView* parentChartView;

@end
