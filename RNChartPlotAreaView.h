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
- (void)nearestDataPointToPoint:(CGPoint)point radius:(CGFloat)radius selectedChartIndex:(NSInteger*)selectedChartIndex selectedPointIndex:(NSInteger*)selectedPointIndex;

@property (nonatomic, weak) RNChartView* parentChartView;

@end
