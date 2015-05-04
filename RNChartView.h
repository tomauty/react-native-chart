//
//  RNChartView.h
//  RNChart
//
//  Created by Hyun Cho on 4/20/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <RCTView.h>

typedef NS_ENUM(NSInteger, RNChartField) {
  RNChartFieldX,
  RNChartFieldY,
};

@class RCTEventDispatcher;

@interface RNChartView : RCTView

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher NS_DESIGNATED_INITIALIZER;

- (CGFloat)horizontalScale;
- (CGFloat)minVerticalBound;
- (CGFloat)maxVerticalBound;

@property (nonatomic, copy) NSArray* chartData;
@property (nonatomic, strong) NSArray* xLabels;

@property (nonatomic, assign) CGFloat labelFontSize;
@property (nonatomic, strong) UIColor* labelTextColor;

// axis
@property (nonatomic, assign) BOOL showAxis;
@property (nonatomic, strong) UIColor* axisColor;
@property (nonatomic, assign) CGFloat axisLineWidth;
@property (nonatomic, copy) NSString* xAxisTitle;
@property (nonatomic, copy) NSString* yAxisTitle;
@property (nonatomic, strong) UIColor* axisTitleColor;
@property (nonatomic, assign) CGFloat axisTitleFontSize;

// grid
@property (nonatomic, assign) BOOL showGrid;
@property (nonatomic, strong) UIColor* gridColor;
@property (nonatomic, assign) CGFloat gridLineWidth;
@property (nonatomic, assign) int verticalGridStep;

// animation
@property (nonatomic, assign) CGFloat animationDuration;

// touch
@property (nonatomic, assign) CGFloat touchRadius;

// title
@property (nonatomic, copy) NSString* chartTitle;
@property (nonatomic, strong) UIColor* chartTitleColor;
@property (nonatomic, assign) CGFloat chartFontSize;

@property (nonatomic, strong) UIColor* defaultColor;


@end
