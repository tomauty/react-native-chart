//
//	RNChartPlotAreaView.m
//	RNChart
//
//	Created by Hyun Cho on 4/30/15.
//	Copyright (c) 2015 Facebook. All rights reserved.
//

#import "RNChartPlotAreaView.h"
#import "RNChartView.h"
#import "RCTConvert.h"
#import <QuartzCore/QuartzCore.h>

@interface RNChartPlotAreaView ()

@property (nonatomic, strong) NSMutableArray* layers;

@end

@implementation RNChartPlotAreaView

- (id)initWithParentView:(RNChartView*)parentChartView {
	self = [super initWithFrame:CGRectZero];
	_layers = [NSMutableArray array];
	_parentChartView = parentChartView;

	self.backgroundColor = [UIColor clearColor];

	return self;
}


- (void)clearChartData
{
	for (CAShapeLayer *layer in self.layers) {
		[layer removeFromSuperlayer];
	}
	[self.layers removeAllObjects];

	[[self subviews] makeObjectsPerformSelector:@selector(removeFromSuperview)];
}


- (void)drawCharts {

	for ( NSDictionary* plotDict in self.parentChartView.chartData ) {
		BOOL showDataPoint = [RCTConvert BOOL:plotDict[@"showDataPoint"]];
		NSString* chartType = [RCTConvert NSString:plotDict[@"type"]];

		if ( [chartType isEqualToString:@"bar"] ) {
			[self drawBarChart:plotDict];
		} else if ( [chartType isEqualToString:@"pie"] ) {
			[self drawPieChart:plotDict];
		} else {
			[self drawLineChart:plotDict];

			if ( showDataPoint ) {
				[self drawDataPoints:plotDict];
			}
		}
	}

}

- (void)drawPieChart:(NSDictionary*)dataDict
{
}

- (void)drawLineChart:(NSDictionary*)dataDict
{
	NSArray* dataPlots = dataDict[@"data"];
	UIColor* lineColor = ( dataDict[@"color"] != nil ) ? [RCTConvert UIColor:dataDict[@"color"]] : self.parentChartView.defaultColor;
	UIColor* fillColor = ( dataDict[@"fillColor"] != nil ) ? [RCTConvert UIColor:dataDict[@"fillColor"]] : nil;
	NSArray* fillGradient = dataDict[@"fillGradient"];
	NSNumber* lineWidth = [RCTConvert NSNumber:dataDict[@"lineWidth"]];
	if ( lineWidth == nil ) {
		lineWidth = @1;
	}

	CGFloat smoothingTension = dataDict[@"smoothingTension"] != nil ? [dataDict[@"smoothingTension"] floatValue] : 0.0;

	CGFloat axisHeight = self.frame.size.height;

	CGFloat minBound = [self.parentChartView minVerticalBound];
	CGFloat maxBound = [self.parentChartView maxVerticalBound];

	CGFloat scale = axisHeight / (maxBound - minBound);

	UIBezierPath *noPath = [self getLinePath:dataPlots scale:0 withSmoothing:smoothingTension close:NO];
	UIBezierPath *path = [self getLinePath:dataPlots scale:scale withSmoothing:smoothingTension close:NO];

	UIBezierPath *noFill = [self getLinePath:dataPlots scale:0 withSmoothing:smoothingTension close:YES];
	UIBezierPath *fill = [self getLinePath:dataPlots scale:scale withSmoothing:smoothingTension close:YES];

	float boundsY = ((maxBound - minBound) == 0) ? 0 : (minBound * scale);
	if( fillGradient != nil) {
		UIColor* topColor = [RCTConvert UIColor:fillGradient[0]];
		UIColor* bottomColor = [RCTConvert UIColor:fillGradient[1]];

		CAShapeLayer* gradientMask = [CAShapeLayer layer];
		gradientMask.frame = CGRectMake(self.bounds.origin.x, self.bounds.origin.y, self.bounds.size.width, self.bounds.size.height);
		gradientMask.bounds = self.bounds;
		gradientMask.path = fill.CGPath;
		gradientMask.strokeColor = nil;
		gradientMask.fillColor = topColor.CGColor;
		gradientMask.lineWidth = 0;
		gradientMask.lineJoin = kCALineJoinRound;

		CAGradientLayer *gradientLayer = [CAGradientLayer layer];
		gradientLayer.frame = gradientMask.frame;
		gradientLayer.colors = [NSArray arrayWithObjects: (id)topColor.CGColor, (id)bottomColor.CGColor, nil];

		[gradientLayer setMask:gradientMask];
		[self.layer addSublayer:gradientLayer];
		[self.layers addObject:gradientLayer];
		[self.layers addObject:gradientMask];

		CABasicAnimation *fillAnimation = [CABasicAnimation animationWithKeyPath:@"path"];
		fillAnimation.duration = self.parentChartView.animationDuration;
		fillAnimation.timingFunction = [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseInEaseOut];
		fillAnimation.fromValue = (id)noFill.CGPath;
		fillAnimation.toValue = (id)fill.CGPath;
		[gradientMask addAnimation:fillAnimation forKey:@"path"];

	}
	else if( fillColor ) {
		CAShapeLayer* fillLayer = [CAShapeLayer layer];
		fillLayer.frame = CGRectMake(self.bounds.origin.x, self.bounds.origin.y, self.bounds.size.width, self.bounds.size.height);
		fillLayer.bounds = self.bounds;
		fillLayer.path = fill.CGPath;
		fillLayer.strokeColor = nil;
		fillLayer.fillColor = fillColor.CGColor;
		fillLayer.lineWidth = 0;
		fillLayer.lineJoin = kCALineJoinRound;

		[self.layer addSublayer:fillLayer];
		[self.layers addObject:fillLayer];

		CABasicAnimation *fillAnimation = [CABasicAnimation animationWithKeyPath:@"path"];
		fillAnimation.duration = self.parentChartView.animationDuration;
		fillAnimation.timingFunction = [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseInEaseOut];
		fillAnimation.fillMode = kCAFillModeForwards;
		fillAnimation.fromValue = (id)noFill.CGPath;
		fillAnimation.toValue = (id)fill.CGPath;
		[fillLayer addAnimation:fillAnimation forKey:@"path"];
	}

	CAShapeLayer *pathLayer = [CAShapeLayer layer];
	pathLayer.frame = CGRectMake(self.bounds.origin.x, self.bounds.origin.y + boundsY, self.bounds.size.width, self.bounds.size.height);
	pathLayer.bounds = self.bounds;
	pathLayer.path = path.CGPath;
	pathLayer.strokeColor = [lineColor CGColor];
	pathLayer.fillColor = nil;
	pathLayer.lineWidth = lineWidth.floatValue;
	pathLayer.lineJoin = kCALineJoinRound;

	[self.layer addSublayer:pathLayer];
	[self.layers addObject:pathLayer];

	if ( fillColor) {
		CABasicAnimation *pathAnimation = [CABasicAnimation animationWithKeyPath:@"path"];
		pathAnimation.duration = self.parentChartView.animationDuration;
		pathAnimation.timingFunction = [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseInEaseOut];
		pathAnimation.fromValue = (__bridge id)(noPath.CGPath);
		pathAnimation.toValue = (__bridge id)(path.CGPath);
		[pathLayer addAnimation:pathAnimation forKey:@"path"];
	} else {
		CABasicAnimation *pathAnimation = [CABasicAnimation animationWithKeyPath:@"strokeEnd"];
		pathAnimation.duration = self.parentChartView.animationDuration;
		pathAnimation.timingFunction = [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseInEaseOut];
		pathAnimation.fromValue = [NSNumber numberWithFloat:0.0f];
		pathAnimation.toValue = [NSNumber numberWithFloat:1.0f];
		[pathLayer addAnimation:pathAnimation forKey:@"path"];
	}
}


- (void)drawBarChart:(NSDictionary*)dataDict {
	NSArray* dataPlots = dataDict[@"data"];
	UIColor* barColor = ( dataDict[@"color"] != nil ) ? [RCTConvert UIColor:dataDict[@"color"]] : self.parentChartView.defaultColor;
	CGFloat widthPercent = ( dataDict[@"widthPercent"] != nil ) ? [RCTConvert CGFloat:dataDict[@"widthPercent"]] : 0.5;
	CGFloat cornerRadius = ( dataDict[@"cornerRadius"] != nil ) ? [RCTConvert CGFloat:dataDict[@"cornerRadius"]] : 1.0;
	widthPercent = MIN(widthPercent, 1.0);
	widthPercent = MAX(widthPercent, 0.0);

	CGFloat axisWidth = self.frame.size.width;
	CGFloat axisHeight = self.frame.size.height;

	CGFloat minBound = [self.parentChartView minVerticalBound];
	CGFloat maxBound = [self.parentChartView maxVerticalBound];

	CGFloat barWidth = (axisWidth / self.parentChartView.xLabels.count * [self.parentChartView horizontalScale] * 0.5) * widthPercent; // 60% of the full width

	for ( NSUInteger i = 0; i < dataPlots.count; ++i ) {

		CGFloat divisor = maxBound - minBound;
		if (divisor == 0.0) {
			divisor = 0.000001;
		}
		CGFloat s = axisHeight / divisor;
		CGPoint point = [self getPointForIndex:i data:dataPlots withScale:s];
		point.y += minBound * s;

		CGFloat height = axisHeight - point.y;
		UIBezierPath* circle;
		if (cornerRadius != 0.0) {
			circle = [UIBezierPath bezierPathWithRoundedRect:CGRectMake(point.x - barWidth, point.y, barWidth * 2, height) cornerRadius:cornerRadius];
		} else {
			circle = [UIBezierPath bezierPathWithRect:CGRectMake(point.x - barWidth, point.y, barWidth * 2, height)];
		}

		CAShapeLayer *fillLayer = [CAShapeLayer layer];
		fillLayer.frame = CGRectMake(point.x, point.y, barWidth, height);
		fillLayer.bounds = CGRectMake(point.x, point.y, barWidth, height);
		fillLayer.path = circle.CGPath;
		fillLayer.strokeColor = barColor.CGColor;
		fillLayer.fillColor = barColor.CGColor;
		fillLayer.lineWidth = 1;
		fillLayer.lineJoin = kCALineJoinRound;

		[self.layer addSublayer:fillLayer];
		[self.layers addObject:fillLayer];

		CABasicAnimation *barGraphFillAnimation = [CABasicAnimation animationWithKeyPath:@"transform.scale.y"];
		[barGraphFillAnimation setDuration:self.parentChartView.animationDuration];

		barGraphFillAnimation.toValue = [NSNumber numberWithFloat:1.0f];
		barGraphFillAnimation.fromValue = [NSNumber numberWithFloat:.0f];
		barGraphFillAnimation.removedOnCompletion = NO;
		barGraphFillAnimation.fillMode = kCAFillModeForwards;
		fillLayer.anchorPoint = CGPointMake(0.0f, 0.5f);
		[fillLayer addAnimation:barGraphFillAnimation forKey:@"grow"];
	}

}


- (void)drawDataPoints:(NSDictionary*)dataDict
{
	NSArray* dataPlots = dataDict[@"data"];
	UIColor* pointColor = ( dataDict[@"dataPointColor"] != nil ) ? [RCTConvert UIColor:dataDict[@"dataPointColor"]] : self.parentChartView.defaultColor;
	UIColor* highlightColor = ( dataDict[@"highlightColor"] != nil ) ? [RCTConvert UIColor:dataDict[@"highlightColor"]] : nil;
	UIColor* pointFillColor = ( dataDict[@"dataPointFillColor"] != nil ) ? [RCTConvert UIColor:dataDict[@"dataPointFillColor"]] : nil;
	NSArray* highlightIndices = dataDict[@"highlightIndices"];

	NSNumber* dataPointRadius = [RCTConvert NSNumber:dataDict[@"dataPointRadius"]];
	NSNumber* highlightRadius = ( dataDict[@"highlightRadius"] != nil ) ? [RCTConvert NSNumber:dataDict[@"highlightRadius"]] : nil;


	CGFloat axisHeight = self.frame.size.height;

	CGFloat minBound = [self.parentChartView minVerticalBound];
	CGFloat maxBound = [self.parentChartView maxVerticalBound];
	CGFloat scale = axisHeight / (maxBound - minBound);

	for ( int i=0; i < dataPlots.count; i++) {
		CGPoint p = [self getPointForIndex:i data:dataPlots withScale:scale];
		NSNumber* radius = dataPointRadius;

		if ( radius == nil ) {
			radius = @1;
		}

		if (CGPointEqualToPoint(p, CGPointZero)) continue;

		// Determine if we should highlight this data point based on its index being in 'highlightIndices'
		BOOL shouldHighlight = NO;
		if( highlightIndices != nil ) {
			for ( int j = 0; j < highlightIndices.count; j++ ) {
				if ([[highlightIndices objectAtIndex:j] integerValue] == i) {
					shouldHighlight = YES;
				}
			}
		}
		p.y +=	minBound * scale;

		if( shouldHighlight && highlightRadius != nil ) {
			radius = highlightRadius;
		}

		UIBezierPath* circle = [UIBezierPath bezierPathWithOvalInRect:CGRectMake(p.x - radius.floatValue, p.y - radius.floatValue, radius.floatValue * 2, radius.floatValue * 2)];

		CAShapeLayer *fillLayer = [CAShapeLayer layer];
		fillLayer.frame     = CGRectMake(p.x, p.y, radius.floatValue, radius.floatValue);
		fillLayer.bounds    = CGRectMake(p.x, p.y, radius.floatValue, radius.floatValue);
		fillLayer.path      = circle.CGPath;
		fillLayer.lineWidth = 1;
		fillLayer.lineJoin  = kCALineJoinRound;

		if( shouldHighlight && highlightColor != nil) {

			fillLayer.fillColor = highlightColor.CGColor;
			fillLayer.strokeColor = highlightColor.CGColor;

		} else {

			fillLayer.fillColor = pointFillColor.CGColor;
			fillLayer.strokeColor = pointColor.CGColor;

		}


		[self.layer addSublayer:fillLayer];
		[self.layers addObject:fillLayer];
	}
}

- (CGPoint)getPointForIndex:(NSUInteger)idx data:(NSArray*)data withScale:(CGFloat)scale
{
	if ( idx >= data.count || data[idx] == [NSNull null] )
		return CGPointZero;

	NSUInteger horizontalGridStep = self.parentChartView.xLabels.count;

	CGFloat axisWidth = self.frame.size.width;
	CGFloat axisHeight = self.frame.size.height;

	CGFloat horizScale = [self.parentChartView horizontalScale];
	CGFloat xOffset = (axisWidth / (horizontalGridStep)) * horizScale * 0.4;

	// Compute the point position in the view from the data with a set scale value
	NSNumber* number = data[idx];

	if ( data.count < 2 ) {
		return CGPointMake(xOffset, axisHeight - [number floatValue] * scale);
	} else {
		return CGPointMake(idx * (axisWidth / (data.count)) + xOffset, axisHeight - [number floatValue] * scale);
	}
}


- (UIBezierPath*)getLinePath:(NSArray*)dataPlots scale:(float)scale withSmoothing:(CGFloat)smoothing close:(BOOL)closed
{
	UIBezierPath* path = [UIBezierPath bezierPath];
	if (scale == +INFINITY) {
		scale = 0;
	}

	for( int i = 0 ; i < dataPlots.count - 1; i++) {
		CGPoint controlPoint[2];
		CGPoint p = [self getPointForIndex:i data:dataPlots withScale:scale];

		// Start the path drawing
		if(i == 0)
			[path moveToPoint:p];

		CGPoint nextPoint, previousPoint, m;

		// First control point
		nextPoint = [self getPointForIndex:i + 1 data:dataPlots withScale:scale];
		previousPoint = [self getPointForIndex:i - 1 data:dataPlots withScale:scale];
		m = CGPointZero;

		if(i > 0) {
			m.x = (nextPoint.x - previousPoint.x) / 2;
			m.y = (nextPoint.y - previousPoint.y) / 2;
		} else {
			m.x = (nextPoint.x - p.x) / 2;
			m.y = (nextPoint.y - p.y) / 2;
		}

		if (CGPointEqualToPoint(p, CGPointZero)) {
			[path moveToPoint:nextPoint];
			continue;
		}

		controlPoint[0].x = p.x + m.x * smoothing;
		controlPoint[0].y = p.y + m.y * smoothing;

		if (CGPointEqualToPoint(nextPoint, CGPointZero)) continue;

		// Second control point
		nextPoint = [self getPointForIndex:i + 2 data:dataPlots withScale:scale];
		previousPoint = [self getPointForIndex:i data:dataPlots withScale:scale];
		p = [self getPointForIndex:i + 1 data:dataPlots withScale:scale];
		m = CGPointZero;

		if(i < dataPlots.count - 2) {
			m.x = (nextPoint.x - previousPoint.x) / 2;
			m.y = (nextPoint.y - previousPoint.y) / 2;
		} else {
			m.x = (p.x - previousPoint.x) / 2;
			m.y = (p.y - previousPoint.y) / 2;
		}

		controlPoint[1].x = p.x - m.x * smoothing;
		controlPoint[1].y = p.y - m.y * smoothing;

		[path addCurveToPoint:p controlPoint1:controlPoint[0] controlPoint2:controlPoint[1]];
	}

	if(closed) {
		// Closing the path for the fill drawing
		[path addLineToPoint:[self getPointForIndex:dataPlots.count - 1 data:dataPlots withScale:scale]];
		[path addLineToPoint:[self getPointForIndex:dataPlots.count - 1 data:dataPlots withScale:0]];
		[path addLineToPoint:[self getPointForIndex:0 data:dataPlots withScale:0]];
		[path addLineToPoint:[self getPointForIndex:0 data:dataPlots withScale:scale]];
	}

	return path;
}


// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
	if ( self.parentChartView.chartData.count > 0 ) {
		if (self.parentChartView.handleAsPieChart) {
			[self drawPie];
		} else {
			[self drawGrid];
		}
	}
}

- (void)drawPie
{

	// Create Frame
	CGContextRef ctx = UIGraphicsGetCurrentContext();
	UIGraphicsPushContext(ctx);

	CGFloat theHalf = self.frame.size.height/2;
	CGFloat lineWidth = theHalf;

	CGFloat radius = theHalf-lineWidth/2;

	CGFloat centerX = self.frame.size.width/2;
	CGFloat centerY = self.frame.size.height/2;

	// Gather Pie Data
	NSDictionary* dataDict = nil;
	for(NSDictionary* item in self.parentChartView.chartData) {
		if ([[item objectForKey:@"type"] isEqualToString:@"pie"]) {
			dataDict = item;
		}
	}

	// Aggregate sums and draw pie chart
	double sum = 0.0f;
	NSArray* pieData = [dataDict objectForKey:@"data"];
	int slicesCount = (int)[pieData count];

	for (int i = 0; i < slicesCount; i++)
	{
		float val = [[pieData objectAtIndex:i] floatValue];
		if (val == 0.0) {
			val = 0.1;
		}
		sum += val;
	}

	float startAngle = - M_PI_2;
	float endAngle = 0.0f;

	for (int i = 0; i < slicesCount; i++)
	{
		double value = [[pieData objectAtIndex:i] floatValue];
		if (value == 0.0) {
			value = 0.1;
		}

		endAngle = startAngle + M_PI * 2 * (value / sum);
		CGContextAddArc(ctx, centerX, centerY, radius, startAngle, endAngle, false);

		// TODO: colors
		UIColor *drawColor = nil;
		[UIColor colorWithRed:(0.05 * i) green:0.0 blue:0.0 alpha:1.0]; //[self.datasource pieChartView:self colorForSliceAtIndex:i];

		NSArray* sliceColors = [dataDict objectForKey:@"sliceColors"];

		if (sliceColors == nil || sliceColors[i] == nil || [sliceColors objectAtIndex:i] == nil) {
			drawColor = [UIColor colorWithRed:(0.2 * i) green:0.0 blue:0.0 alpha:1.0];
		} else {
			drawColor = [RCTConvert UIColor:sliceColors[i]];
		}

		CGContextSetStrokeColorWithColor(ctx, drawColor.CGColor);
		CGContextSetLineWidth(ctx, lineWidth);
		CGContextStrokePath(ctx);
		startAngle += M_PI * 2 * (value/sum);
	}
	UIGraphicsPopContext();

}


- (void)drawGrid
{
	CGContextRef ctx = UIGraphicsGetCurrentContext();
	UIGraphicsPushContext(ctx);

	CGFloat axisWidth = self.frame.size.width;
	CGFloat axisHeight = self.frame.size.height;

	if ( self.parentChartView.showAxis ) {
		CGContextSetLineWidth(ctx, self.parentChartView.axisLineWidth);
		CGContextSetStrokeColorWithColor(ctx, [self.parentChartView.axisColor CGColor]);

		// draw coordinate axis
		CGContextMoveToPoint(ctx, 0, 0);
		CGContextAddLineToPoint(ctx, 0, axisHeight);
		CGContextStrokePath(ctx);

	}

	CGFloat scale = [self.parentChartView horizontalScale];
	CGFloat minBound = [self.parentChartView minVerticalBound];
	CGFloat maxBound = [self.parentChartView maxVerticalBound];

	// draw grid
	if ( self.parentChartView.showGrid ) {
		NSUInteger horizontalGridStep = self.parentChartView.xLabels.count;

		// vertical lines
		if( !self.parentChartView.hideVerticalGridLines){
			for(int i=0; i< horizontalGridStep; i++) {
				CGContextSetStrokeColorWithColor(ctx, [self.parentChartView.gridColor CGColor]);
				CGContextSetLineWidth(ctx, self.parentChartView.gridLineWidth);

				CGPoint point = CGPointMake((1 + i) * axisWidth / horizontalGridStep * scale, 0);

				CGContextMoveToPoint(ctx, point.x, point.y);
				CGContextAddLineToPoint(ctx, point.x, axisHeight);
				CGContextStrokePath(ctx);
			}
		}

		// horizontal lines
		if( !self.parentChartView.hideHorizontalGridLines){
			for ( int i = 0; i < self.parentChartView.verticalGridStep + 1; i++) {
				// If the value is zero then we display the horizontal axis
				CGFloat v = maxBound - (maxBound - minBound) / self.parentChartView.verticalGridStep * i;
				CGFloat lowestPoint = maxBound - (maxBound - minBound);

				if ( v == lowestPoint && self.parentChartView.showAxis ) {
					CGContextSetLineWidth(ctx, self.parentChartView.axisLineWidth);
					CGContextSetStrokeColorWithColor(ctx, [self.parentChartView.axisColor CGColor]);
				} else {
					CGContextSetStrokeColorWithColor(ctx, [self.parentChartView.gridColor CGColor]);
					CGContextSetLineWidth(ctx, self.parentChartView.gridLineWidth);
				}

				CGPoint point = CGPointMake(0, (i) * axisHeight / self.parentChartView.verticalGridStep);

				CGContextMoveToPoint(ctx, point.x, point.y);
				CGContextAddLineToPoint(ctx, axisWidth, point.y);
				CGContextStrokePath(ctx);
			}
		}
	}

	UIGraphicsPopContext();
}


- (CGFloat)distanceSquare:(CGPoint)point1 point2:(CGPoint)point2 {
	CGFloat d1 = point1.x - point2.x;
	CGFloat d2 = point1.y - point2.y;
	return d1 * d1 + d2 * d2;
}


- (void)nearestDataPointToPoint:(CGPoint)point radius:(CGFloat)radius selectedChartIndex:(NSInteger*)selectedChartIndex selectedPointIndex:(NSInteger*)selectedPointIndex {
	CGFloat minBound = [self.parentChartView minVerticalBound];
	CGFloat maxBound = [self.parentChartView maxVerticalBound];
	CGFloat radiusSq = radius * radius;

	[self.parentChartView.chartData enumerateObjectsWithOptions:NSEnumerationReverse usingBlock:^(id obj, NSUInteger idx1, BOOL *stop1) {
		NSArray* dataPlots = obj[@"data"];
		[dataPlots enumerateObjectsUsingBlock:^(id obj, NSUInteger idx2, BOOL *stop2) {
			CGFloat s = self.frame.size.height / (maxBound - minBound);
			CGPoint tempPoint = [self getPointForIndex:idx2 data:dataPlots withScale:s];

			if ( [self distanceSquare:point point2:tempPoint] < radiusSq ) {
				*stop1 = YES;
				*stop2 = YES;
				*selectedChartIndex = idx1;
				*selectedPointIndex = idx2;
			}
		}];
	}];
}



@end
