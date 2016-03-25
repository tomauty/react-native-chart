//
//	RNChartView.m
//	RNChart
//
//	Created by Hyun Cho on 4/20/15.
//	Copyright (c) 2015 Facebook. All rights reserved.
//

#import "RNChartView.h"
#import "RCTEventDispatcher.h"
#import "RCTConvert.h"
#import "UIView+React.h"
#import "RNChartPlotAreaView.h"
#import "RNChartAxisView.h"

@interface RNChartView ()

@property (nonatomic, strong) NSMutableArray* layers;

@property (nonatomic) CGFloat min;
@property (nonatomic) CGFloat max;

@property (nonatomic) CGFloat axisWidth;
@property (nonatomic) CGFloat axisHeight;

@property (nonatomic, strong) UIFont* labelFont;

@property (nonatomic, strong) UILabel* titleLabel;

@property (nonatomic, strong) RNChartPlotAreaView* plotArea;
@property (nonatomic, strong) RNChartAxisView* xAxisView;
@property (nonatomic, strong) RNChartAxisView* yAxisView;

@property (nonatomic, assign) CGFloat spacing;

@property (nonatomic, assign) CGFloat xAxisHeight;
@property (nonatomic, assign) CGFloat yAxisWidth;

@end

@implementation RNChartView
{
	RCTEventDispatcher *_eventDispatcher;
}

#pragma mark - Initialisation

- (id)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher
{
	if (self = [super initWithFrame:CGRectZero]) {
		[self setDefaultParameters];

		_eventDispatcher = eventDispatcher;
		_layers = [NSMutableArray array];

		self.backgroundColor = [UIColor whiteColor];
	}
	return self;
}


- (void)layoutSubviews {
	[super layoutSubviews];

	[self clearChartData];

	[self buildChart];

}


- (void)setChartData:(NSArray *)chartData {
	_chartData = chartData;

	[self setNeedsLayout];
}


- (void)setLabelFontSize:(CGFloat)labelFontSize {
	_labelFontSize = labelFontSize;

	_labelFont = [UIFont fontWithName:@"HelveticaNeue-Light" size:_labelFontSize];
}


- (void)buildChart {
	if ( self.chartData.count == 0 ) {
		return;
	}

	// We don't want to draw axis if there's a pie chart. Why would you make a pie chart and a line at the same time?
	self.handleAsPieChart = NO;
	for ( NSDictionary* plotDict in self.chartData ) {
		NSString* type = plotDict[@"type"];
		if( [type isEqualToString:@"pie"] ) {
			self.handleAsPieChart = YES;
			self.showGrid = NO;
			self.showAxis = NO;
		}
	}


	self.xAxisHeight = 16.0;
	if ( !self.showXAxisLabels ) {
		self.xAxisHeight -= 16.0;
	}
	if ( self.xAxisTitle.length > 0 ) {
		UIFont* font = [UIFont systemFontOfSize:self.axisTitleFontSize];
		CGRect titleBound = [self.xAxisTitle boundingRectWithSize:CGSizeMake(10000, 10000)
																				 options:NSStringDrawingUsesLineFragmentOrigin
																				 attributes:@{ NSFontAttributeName:font}
																				 context:nil];

		self.xAxisHeight += titleBound.size.height + 2;
	}
	self.yAxisWidth = 24.0;
	if ( !self.showYAxisLabels ) {
		self.yAxisWidth -= 24.0;
	}
	if (self.handleAsPieChart) {
		self.yAxisWidth = 0.0;
	}
	if ( self.yAxisTitle.length > 0 ) {
		UIFont* font = [UIFont systemFontOfSize:self.axisTitleFontSize];
		CGRect titleBound = [self.yAxisTitle boundingRectWithSize:CGSizeMake(10000, 10000)
																				 options:NSStringDrawingUsesLineFragmentOrigin
																				 attributes:@{ NSFontAttributeName:font}
																				 context:nil];

		self.yAxisWidth += titleBound.size.height + 2;
	}

	self.plotArea = [[RNChartPlotAreaView alloc] initWithParentView:self];
	[self addSubview:self.plotArea];

	self.xAxisView = [[RNChartAxisView alloc] initWithParent:self axis:AxisTypeX];
	[self addSubview:self.xAxisView];

	self.yAxisView = [[RNChartAxisView alloc] initWithParent:self axis:AxisTypeY];
	[self addSubview:self.yAxisView];

	[self computeBounds];
	[self createChartTitleLabel];

	// title label
	self.titleLabel.frame = CGRectMake(0, 0, self.frame.size.width, self.titleLabel.frame.size.height);
	CGFloat y = (self.titleLabel.frame.size.height + self.spacing);

	// y axis
	self.yAxisView.frame = CGRectMake(0, y, self.yAxisWidth, self.frame.size.height - self.titleLabel.frame.size.height - self.spacing - self.xAxisHeight - self.spacing );

	// plot area
	self.plotArea.frame = CGRectMake(self.yAxisWidth + self.spacing, y,
																	 self.frame.size.width - self.yAxisWidth - self.spacing,
																	 self.frame.size.height - self.titleLabel.frame.size.height - self.spacing - self.spacing - self.xAxisHeight);

	// x axis
	self.xAxisView.frame = CGRectMake(self.yAxisWidth + self.spacing, self.frame.size.height - self.xAxisHeight,
																		self.frame.size.width - self.yAxisWidth - self.spacing,
																		self.xAxisHeight );

	self.axisWidth = self.plotArea.frame.size.width;
	self.axisHeight = self.plotArea.frame.size.height;

	// No data
	if ( isnan(self.max) )	{
		self.max = 1;
	}

	[self.plotArea drawCharts];

	if( !self.handleAsPieChart ) {
		[self.yAxisView addLabels];
		[self.xAxisView addLabels];
	}

	[self setNeedsDisplay];
}


- (void)setDefaultParameters {

	_defaultColor = [UIColor blueColor];
	_verticalGridStep = 3;
	_showAxis = YES;
	_showXAxisLabels = YES;
	_showYAxisLabels = YES;
	_axisColor = [UIColor colorWithWhite:0.7 alpha:1.0];
	_gridColor = [UIColor colorWithWhite:0.9 alpha:1.0];
	_showGrid = YES;
	_gridLineWidth = 0.5;
	_axisLineWidth = 1;
	_animationDuration = 0.5;
	_touchRadius = 5.0;

	// Labels attributes
	_labelFontSize = 10;
	_labelTextColor = [UIColor grayColor];
	_labelFont = [UIFont fontWithName:@"HelveticaNeue-Light" size:_labelFontSize];

	_chartFontSize = 14.0;

	_axisWidth = self.frame.size.width;
	_axisHeight = self.frame.size.height;

//	_chartTitle = @"Sample Chart";
	_spacing = 1.0;

	_xAxisHeight = 16.0;
	_yAxisWidth = 24.0;

//	_xAxisTitle = @"X Axis";
//	_yAxisTitle = @"Y Axis";
	_axisTitleColor = [UIColor grayColor];
	_axisTitleFontSize = 16;
	_tightBounds = NO;
}


- (void)createChartTitleLabel {
	if ( self.chartTitle.length > 0 ) {
		UILabel* chartTitle = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, self.frame.size.width, 9999)];
		chartTitle.text = self.chartTitle;
		chartTitle.textColor = (self.chartTitleColor != nil) ? self.chartTitleColor : [UIColor grayColor];
		chartTitle.font = [UIFont boldSystemFontOfSize:self.chartFontSize];
		chartTitle.textAlignment = NSTextAlignmentCenter;
		CGSize size = [chartTitle sizeThatFits:CGSizeMake(self.frame.size.width, 9999)];
		chartTitle.frame = CGRectMake(0, 0, size.width, size.height);
		[self addSubview:chartTitle];

		self.titleLabel = chartTitle;
	}
}

#pragma mark - Drawing

- (void)clearChartData
{
	for (CAShapeLayer *layer in self.layers) {
		[layer removeFromSuperlayer];
	}
	[self.layers removeAllObjects];

	[[self subviews] makeObjectsPerformSelector:@selector(removeFromSuperview)];
}


#pragma mark - Chart scale & boundaries

- (CGFloat)horizontalScale
{
	NSUInteger horizontalGridStep = self.xLabels.count + 1;
	CGFloat scale = 1.0f;
//	for ( NSDictionary* plotDict in self.chartData ) {
//		NSArray* plotArray = plotDict[@"data"];
//		NSInteger q = (int)plotArray.count / horizontalGridStep;
//
//		if(plotArray.count > 1) {
//			CGFloat thisScale = (CGFloat)(q * horizontalGridStep) / (CGFloat)(plotArray.count);
//			scale = MAX(scale, thisScale);
//		}
//	}

	return scale;
}


- (CGFloat)minVerticalBound
{
	// if we want the bounds to be tight, return the actual bound
	if (self.tightBounds) {
		return self.min;
	// otherwise min with 0
	} else {
		return MIN(self.min, 0);
	}
}


- (CGFloat)maxVerticalBound
{
	// if we want the bounds to be tight, return the actual bound
	if (self.tightBounds) {
		return self.max;
	// otherwise max with 0
	} else {
		return MAX(self.max, 0);
	}
}

- (void)computeBounds
{
	self.min = MAXFLOAT;
	self.max = -MAXFLOAT;

	// git the minimumest and maximumest from our data arrays
	for ( NSDictionary* plotDict in self.chartData ) {
		NSArray* data = plotDict[@"data"];
		for(int i=0; i < data.count; i++) {
			if (data[i] == [NSNull null]) continue;
			NSNumber* number = data[i];
			if([number floatValue] < self.min)
				self.min = [number floatValue];

			if([number floatValue] > self.max)
				self.max = [number floatValue];
		}
	}

	// if we want the bounds to be tight, exit here
	if (self.tightBounds) {
		return;
	}

	// The idea is to adjust the minimun and the maximum value to display the whole chart in the view, and if possible with nice "round" steps.
	self.max = [self getUpperRoundNumber:self.max forGridStep:self.verticalGridStep];

	if(self.min < 0) {
		// If the minimum is negative then we want to have one of the step to be zero so that the chart is displayed nicely and more comprehensively
		float step;

		if(self.verticalGridStep > 3) {
			step = fabs(self.max - self.min) / (float)(self.verticalGridStep - 1);
		} else {
			step = MAX(fabs(self.max - self.min) / 2, MAX(fabs(self.min), fabs(self.max)));
		}

		step = [self getUpperRoundNumber:step forGridStep:self.verticalGridStep];

		float newMin,newMax;

		if(fabs(self.min) > fabs(self.max)) {
			int m = ceilf(fabs(self.min) / step);

			newMin = step * m * (self.min > 0 ? 1 : -1);
			newMax = step * (self.verticalGridStep - m) * (self.max > 0 ? 1 : -1);

		} else {
			int m = ceilf(fabs(self.max) / step);

			newMax = step * m * (self.max > 0 ? 1 : -1);
			newMin = step * (self.verticalGridStep - m) * (self.min > 0 ? 1 : -1);
		}

		if(self.min < newMin) {
			newMin -= step;
			newMax -=	step;
		}

		if(self.max > newMax + step) {
			newMin += step;
			newMax +=	step;
		}

		self.min = newMin;
		self.max = newMax;

		if(self.max < self.min) {
			float tmp = self.max;
			self.max = self.min;
			self.min = tmp;
		}
	}

}

#pragma mark - Chart utils

- (CGFloat)getUpperRoundNumber:(CGFloat)value forGridStep:(int)gridStep
{
	if(value <= 0)
		return 0;

	// We consider a round number the following by 0.5 step instead of true round number (with step of 1)
	CGFloat logValue = log10f(value);
	CGFloat scale = powf(10, floorf(logValue));
	CGFloat n = ceilf(value / scale * 4);

	int tmp = (int)(n) % gridStep;

	if(tmp != 0) {
		n += gridStep - tmp;
	}

	return n * scale / 4.0f;
}


- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
	UITouch *aTouch = [touches anyObject];
	CGPoint point = [aTouch locationInView:self.plotArea];

	NSInteger selectedChartIndex = -1;
	NSInteger selectedPointIndex = -1;

	[self.plotArea nearestDataPointToPoint:point radius:self.touchRadius selectedChartIndex:&selectedChartIndex selectedPointIndex:&selectedPointIndex];
	if ( selectedChartIndex >= 0 && selectedPointIndex >= 0 ) {
//		NSDictionary *event =
//		@{@"target":[self reactTag],
//			@"selectedChartIndex":@(selectedChartIndex),
//			@"selectedPointIndex":@(selectedPointIndex)};
//			[_eventDispatcher sendInputEventWithName:@"dataPointTouchStart" body:event];
//			[_eventDispatcher sendDeviceEventWithName:@"dataPointTouchStart" body:event];
	}

	[super touchesBegan:touches withEvent:event];
}


- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event {
	UITouch *aTouch = [touches anyObject];
	CGPoint point = [aTouch locationInView:self.plotArea];

	NSInteger selectedChartIndex = -1;
	NSInteger selectedPointIndex = -1;

	[self.plotArea nearestDataPointToPoint:point radius:self.touchRadius selectedChartIndex:&selectedChartIndex selectedPointIndex:&selectedPointIndex];
	if ( selectedChartIndex >= 0 && selectedPointIndex >= 0 ) {
//		NSDictionary *event =
//			@{@"target":[self reactTag],
//				@"selectedChartIndex":@(selectedChartIndex),
//				@"selectedPointIndex":@(selectedPointIndex)};
//		[_eventDispatcher sendInputEventWithName:@"topTouchEnd" body:event];
	}

	[super touchesEnded:touches withEvent:event];
}


@end
