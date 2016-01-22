//
//	RNChartPlotAxisView.h
//	RNChart
//
//	Created by Hyun Cho on 4/30/15.
//	Copyright (c) 2015 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, AxisType) {
	AxisTypeNone,
	AxisTypeX,
	AxisTypeY,
};

@class RNChartView;

@interface RNChartAxisView : UIView

- (id)initWithParent:(RNChartView*)parent axis:(AxisType)axis;
- (void)addLabels;

@property (nonatomic, weak) RNChartView* parentChartView;
@property (nonatomic, assign) AxisType axis;
@property (nonatomic, strong) UIFont* labelFont;
@property (nonatomic, strong) UIColor* labelTextColor;

@end
