//
//  RNChartView.m
//  RNChart
//
//  Created by Hyun Cho on 4/20/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "RNChartView.h"
#import "RCTEventDispatcher.h"
#import "RCTConvert.h"

@interface RNChartView ()

@property (nonatomic, strong) NSMutableArray* layers;

@property (nonatomic) CGFloat min;
@property (nonatomic) CGFloat max;

@property (nonatomic) CGFloat axisWidth;
@property (nonatomic) CGFloat axisHeight;

@property (nonatomic) BOOL bezierSmoothing;
@property (nonatomic) CGFloat bezierSmoothingTension;

@property (nonatomic, strong) UIColor* defaultColor;

@property (nonatomic, strong) UIFont* labelFont;

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
  
  self.axisWidth = self.frame.size.width - 2 * self.margin;
  self.axisHeight = self.frame.size.height - 2 * self.margin;
  
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
  
  [self computeBounds];
  
  // No data
  if ( isnan(self.max) )  {
    self.max = 1;
  }
  
  for ( NSDictionary* plotDict in self.chartData ) {
    BOOL showDataPoint = [RCTConvert BOOL:plotDict[@"showDataPoint"]];
    NSString* chartType = [RCTConvert NSString:plotDict[@"type"]];
    
    if ( [chartType isEqualToString:@"bar"] ) {
      [self drawBarChart:plotDict];
    } else {
      [self drawLineChart:plotDict];
      
      if ( showDataPoint ) {
        [self drawDataPoints:plotDict];
      }
    }
  }
  
  for ( int i = 0; i < self.verticalGridStep; i++ ) {
    UILabel* label = [self createLabelForValue:i];
    
    if ( label ) {
      [self addSubview:label];
    }
  }
  
  NSUInteger horizontalGridStep = self.xLabels.count;
  for( int i=0; i< horizontalGridStep; i++ ) {
    UILabel* label = [self createLabelForIndex:i];
    
    if(label) {
      [self addSubview:label];
    }
  }
  
  [self setNeedsDisplay];
}


- (void)setDefaultParameters {
  
  _defaultColor = [UIColor blueColor];
  _verticalGridStep = 3;
  _margin = 5.0f;
  _showAxis = YES;
  _axisColor = [UIColor colorWithWhite:0.7 alpha:1.0];
  _gridColor = [UIColor colorWithWhite:0.9 alpha:1.0];
  _showGrid = YES;
  _bezierSmoothing = YES;
  _bezierSmoothingTension = 0.2;
  _gridLineWidth = 0.5;
  _axisLineWidth = 1;
  _animationDuration = 0.5;
  
  // Labels attributes
  _labelFontSize = 10;
  _labelTextColor = [UIColor grayColor];
  _labelFont = [UIFont fontWithName:@"HelveticaNeue-Light" size:_labelFontSize];
  
  _axisWidth = self.frame.size.width - 2 * _margin;
  _axisHeight = self.frame.size.height - 2 * _margin;
  
}



#pragma mark - Labels creation

- (UILabel*)createLabelForValue: (NSUInteger)index
{
  CGFloat minBound = [self minVerticalBound];
  CGFloat maxBound = [self maxVerticalBound];
  
  CGPoint p = CGPointMake(self.margin, self.axisHeight + self.margin - (index + 1) * self.axisHeight / self.verticalGridStep);
  
  NSUInteger valueIndex = minBound + (maxBound - minBound) / self.verticalGridStep * (index + 1);
  NSString* text = [NSString stringWithFormat:@"%ld", valueIndex];
  
  if(!text)
  {
    return nil;
  }
  
  CGRect rect = CGRectMake(self.margin, p.y + 2, self.frame.size.width - self.margin * 2 - 4.0f, 14);
  
  float width = [text boundingRectWithSize:rect.size
                                   options:NSStringDrawingUsesLineFragmentOrigin
                                attributes:@{ NSFontAttributeName:self.labelFont }
                                   context:nil].size.width;
  
  CGFloat xPadding = 10;
  CGFloat xOffset = width + xPadding;
  
  UILabel* label = [[UILabel alloc] initWithFrame:CGRectMake(p.x - xOffset, p.y + 2, width + 2, 14)];
  label.text = text;
  label.font = self.labelFont;
  label.textColor = self.labelTextColor;
  label.textAlignment = NSTextAlignmentCenter;
  
  return label;
}

- (UILabel*)createLabelForIndex: (NSUInteger)index
{
  CGFloat scale = [self horizontalScale];
  NSString* text = self.xLabels[index];
  if(!text)
  {
    return nil;
  }
  
  NSUInteger horizontalGridStep = self.xLabels.count;
  CGPoint p = CGPointMake(self.margin + index * (self.axisWidth / horizontalGridStep) * scale, self.axisHeight + self.margin);
  
  CGRect rect = CGRectMake(self.margin, p.y + 2, self.frame.size.width - self.margin * 2 - 4.0f, 14);
  
  float width = [text boundingRectWithSize:rect.size
                                   options:NSStringDrawingUsesLineFragmentOrigin
                                attributes:@{ NSFontAttributeName:self.labelFont }
                                   context:nil].size.width;
  
  UILabel* label = [[UILabel alloc] initWithFrame:CGRectMake(p.x - 4.0f, p.y + 2, width + 2, 14)];
  label.text = text;
  label.font = self.labelFont;
  label.textColor = self.labelTextColor;
  
  return label;
}

#pragma mark - Drawing

- (void)drawRect:(CGRect)rect
{
  if ( self.chartData > 0 ) {
    [self drawGrid];
  }
}


- (void)drawGrid
{
  CGContextRef ctx = UIGraphicsGetCurrentContext();
  UIGraphicsPushContext(ctx);
  
  if ( self.showAxis ) {
    CGContextSetLineWidth(ctx, self.axisLineWidth);
    CGContextSetStrokeColorWithColor(ctx, [self.axisColor CGColor]);
    
    // draw coordinate axis
    CGContextMoveToPoint(ctx, self.margin, self.margin);
    CGContextAddLineToPoint(ctx, self.margin, self.axisHeight + self.margin + 3);
    CGContextStrokePath(ctx);
    
  }
  
  CGFloat scale = [self horizontalScale];
  CGFloat minBound = [self minVerticalBound];
  CGFloat maxBound = [self maxVerticalBound];
  
  // draw grid
  if ( self.showGrid ) {
    NSUInteger horizontalGridStep = self.xLabels.count;
    for(int i=0; i< horizontalGridStep; i++) {
      CGContextSetStrokeColorWithColor(ctx, [self.gridColor CGColor]);
      CGContextSetLineWidth(ctx, self.gridLineWidth);
      
      CGPoint point = CGPointMake((1 + i) * self.axisWidth / horizontalGridStep * scale + self.margin, self.margin);
      
      CGContextMoveToPoint(ctx, point.x, point.y);
      CGContextAddLineToPoint(ctx, point.x, self.axisHeight + self.margin);
      CGContextStrokePath(ctx);
    }
    
    for(int i=0; i<self.verticalGridStep + 1; i++) {
      // If the value is zero then we display the horizontal axis
      CGFloat v = maxBound - (maxBound - minBound) / self.verticalGridStep * i;
      
      if ( v == 0 && self.showAxis ) {
        CGContextSetLineWidth(ctx, self.axisLineWidth);
        CGContextSetStrokeColorWithColor(ctx, [self.axisColor CGColor]);
      } else {
        CGContextSetStrokeColorWithColor(ctx, [self.gridColor CGColor]);
        CGContextSetLineWidth(ctx, self.gridLineWidth);
      }
      
      CGPoint point = CGPointMake(self.margin, (i) * self.axisHeight / self.verticalGridStep + self.margin);
      
      CGContextMoveToPoint(ctx, point.x, point.y);
      CGContextAddLineToPoint(ctx, self.axisWidth + self.margin, point.y);
      CGContextStrokePath(ctx);
    }
  }
  
  UIGraphicsPopContext();
}


- (void)clearChartData
{
  for (CAShapeLayer *layer in self.layers) {
    [layer removeFromSuperlayer];
  }
  [self.layers removeAllObjects];
  
  [[self subviews] makeObjectsPerformSelector:@selector(removeFromSuperview)];
}


- (void)drawLineChart:(NSDictionary*)dataDict
{
  NSArray* dataPlots = dataDict[@"data"];
  UIColor* lineColor = ( dataDict[@"color"] != nil ) ? [RCTConvert UIColor:dataDict[@"color"]] : self.defaultColor;
  UIColor* fillColor = ( dataDict[@"fillColor"] != nil ) ? [RCTConvert UIColor:dataDict[@"fillColor"]] : nil;
  NSNumber* lineWidth = [RCTConvert NSNumber:dataDict[@"lineWidth"]];
  if ( lineWidth == nil ) {
    lineWidth = @1;
  }
  
  CGFloat smoothingTension = dataDict[@"smoothingTension"] != nil ? [dataDict[@"smoothingTension"] floatValue] : _bezierSmoothingTension;
  
  if (dataDict[@"smoothing"] != nil && [dataDict[@"smoothing"] boolValue] == NO) {
    smoothingTension = 0;
  }
  
  CGFloat minBound = [self minVerticalBound];
  CGFloat maxBound = [self maxVerticalBound];
  
  CGFloat scale = self.axisHeight / (maxBound - minBound);
  
  UIBezierPath *noPath = [self getLinePath:dataPlots scale:0 withSmoothing:smoothingTension close:NO];
  UIBezierPath *path = [self getLinePath:dataPlots scale:scale withSmoothing:smoothingTension close:NO];
  
  UIBezierPath *noFill = [self getLinePath:dataPlots scale:0 withSmoothing:smoothingTension close:YES];
  UIBezierPath *fill = [self getLinePath:dataPlots scale:scale withSmoothing:smoothingTension close:YES];
  
  if( fillColor ) {
    CAShapeLayer* fillLayer = [CAShapeLayer layer];
    fillLayer.frame = CGRectMake(self.bounds.origin.x, self.bounds.origin.y + minBound * scale, self.bounds.size.width, self.bounds.size.height);
    fillLayer.bounds = self.bounds;
    fillLayer.path = fill.CGPath;
    fillLayer.strokeColor = nil;
    fillLayer.fillColor = fillColor.CGColor;
    fillLayer.lineWidth = 0;
    fillLayer.lineJoin = kCALineJoinRound;
    
    [self.layer addSublayer:fillLayer];
    [self.layers addObject:fillLayer];
    
    CABasicAnimation *fillAnimation = [CABasicAnimation animationWithKeyPath:@"path"];
    fillAnimation.duration = self.animationDuration;
    fillAnimation.timingFunction = [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseInEaseOut];
    fillAnimation.fillMode = kCAFillModeForwards;
    fillAnimation.fromValue = (id)noFill.CGPath;
    fillAnimation.toValue = (id)fill.CGPath;
    [fillLayer addAnimation:fillAnimation forKey:@"path"];
  }
  
  CAShapeLayer *pathLayer = [CAShapeLayer layer];
  pathLayer.frame = CGRectMake(self.bounds.origin.x, self.bounds.origin.y + minBound * scale, self.bounds.size.width, self.bounds.size.height);
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
    pathAnimation.duration = self.animationDuration;
    pathAnimation.timingFunction = [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseInEaseOut];
    pathAnimation.fromValue = (__bridge id)(noPath.CGPath);
    pathAnimation.toValue = (__bridge id)(path.CGPath);
    [pathLayer addAnimation:pathAnimation forKey:@"path"];
  } else {
    CABasicAnimation *pathAnimation = [CABasicAnimation animationWithKeyPath:@"strokeEnd"];
    pathAnimation.duration = self.animationDuration;
    pathAnimation.timingFunction = [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseInEaseOut];
    pathAnimation.fromValue = [NSNumber numberWithFloat:0.0f];
    pathAnimation.toValue = [NSNumber numberWithFloat:1.0f];
    [pathLayer addAnimation:pathAnimation forKey:@"path"];
  }
}


- (void)drawBarChart:(NSDictionary*)dataDict {
  NSArray* dataPlots = dataDict[@"data"];
  UIColor* barColor = ( dataDict[@"color"] != nil ) ? [RCTConvert UIColor:dataDict[@"color"]] : self.defaultColor;
  CGFloat widthPercent = ( dataDict[@"widthPercent"] != nil ) ? [RCTConvert CGFloat:dataDict[@"widthPercent"]] : 0.5;
  widthPercent = MIN(widthPercent, 1.0);
  widthPercent = MAX(widthPercent, 0.0);
  
  CGFloat minBound = [self minVerticalBound];
  CGFloat maxBound = [self maxVerticalBound];
  
  CGFloat barWidth = (self.axisWidth / self.xLabels.count * [self horizontalScale] * 0.5) * widthPercent; // 60% of the full width
  
  for ( NSUInteger i = 0; i < dataPlots.count; ++i ) {
    
    CGFloat s = self.axisHeight / (maxBound - minBound);
    CGPoint point = [self getPointForIndex:i data:dataPlots withScale:s];
    point.y +=  minBound * s;
    
    CGFloat height = (self.axisHeight + self.margin) - point.y;
    UIBezierPath* circle = [UIBezierPath bezierPathWithRoundedRect:CGRectMake(point.x - barWidth, point.y, barWidth * 2, height) cornerRadius:1.0];
    
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
  }
  
}


- (void)drawDataPoints:(NSDictionary*)dataDict
{
  NSArray* dataPlots = dataDict[@"data"];
  UIColor* pointColor = ( dataDict[@"dataPointColor"] != nil ) ? [RCTConvert UIColor:dataDict[@"dataPointColor"]] : self.defaultColor;
  UIColor* pointFillColor = ( dataDict[@"dataPointFillColor"] != nil ) ? [RCTConvert UIColor:dataDict[@"dataPointFillColor"]] : nil;
  NSNumber* radius = [RCTConvert NSNumber:dataDict[@"dataPointRadius"]];
  if ( radius == nil ) {
    radius = @1;
  }
  
  CGFloat minBound = [self minVerticalBound];
  CGFloat maxBound = [self maxVerticalBound];
  CGFloat scale = self.axisHeight / (maxBound - minBound);
  
  for ( int i=0; i < dataPlots.count; i++) {
    CGPoint p = [self getPointForIndex:i data:dataPlots withScale:scale];
    p.y +=  minBound * scale;
    
    UIBezierPath* circle = [UIBezierPath bezierPathWithOvalInRect:CGRectMake(p.x - radius.floatValue, p.y - radius.floatValue, radius.floatValue * 2, radius.floatValue * 2)];
    
    CAShapeLayer *fillLayer = [CAShapeLayer layer];
    fillLayer.frame = CGRectMake(p.x, p.y, radius.floatValue, radius.floatValue);
    fillLayer.bounds = CGRectMake(p.x, p.y, radius.floatValue, radius.floatValue);
    fillLayer.path = circle.CGPath;
    fillLayer.strokeColor = pointColor.CGColor;
    fillLayer.fillColor = pointFillColor.CGColor;
    fillLayer.lineWidth = 1;
    fillLayer.lineJoin = kCALineJoinRound;
    
    [self.layer addSublayer:fillLayer];
    [self.layers addObject:fillLayer];
  }
}

#pragma mark - Chart scale & boundaries

- (CGFloat)horizontalScale
{
  NSUInteger horizontalGridStep = self.xLabels.count;
  CGFloat scale = 1.0f;
  for ( NSDictionary* plotDict in self.chartData ) {
    NSArray* plotArray = plotDict[@"data"];
    NSInteger q = (int)plotArray.count / horizontalGridStep;
    
    if(plotArray.count > 1) {
      CGFloat thisScale = (CGFloat)(q * horizontalGridStep) / (CGFloat)(plotArray.count - 1);
      scale = MAX(scale, thisScale);
    }
  }
  
  return scale;
}


- (CGFloat)minVerticalBound
{
  return MIN(self.min, 0);
}


- (CGFloat)maxVerticalBound
{
  return MAX(self.max, 0);
}

- (void)computeBounds
{
  self.min = MAXFLOAT;
  self.max = -MAXFLOAT;
  
  for ( NSDictionary* plotDict in self.chartData ) {
    NSArray* data = plotDict[@"data"];
    for(int i=0; i < data.count; i++) {
      NSNumber* number = data[i];
      if([number floatValue] < self.min)
        self.min = [number floatValue];
      
      if([number floatValue] > self.max)
        self.max = [number floatValue];
    }
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
      newMax -=  step;
    }
    
    if(self.max > newMax + step) {
      newMin += step;
      newMax +=  step;
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

- (void)setGridStep:(int)gridStep
{
  self.verticalGridStep = gridStep;
  //  self.horizontalGridStep = gridStep;
}

- (CGPoint)getPointForIndex:(NSUInteger)idx data:(NSArray*)data withScale:(CGFloat)scale
{
  if ( idx >= data.count )
    return CGPointZero;
  
  // Compute the point position in the view from the data with a set scale value
  NSNumber* number = data[idx];
  
  if ( data.count < 2 ) {
    return CGPointMake(self.margin, self.axisHeight + self.margin - [number floatValue] * scale);
  } else {
    return CGPointMake(self.margin + idx * (self.axisWidth / (data.count - 1)), self.axisHeight + self.margin - [number floatValue] * scale);
  }
}

- (UIBezierPath*)getLinePath:(NSArray*)dataPlots scale:(float)scale withSmoothing:(CGFloat)smoothing close:(BOOL)closed
{
  UIBezierPath* path = [UIBezierPath bezierPath];
  
  BOOL smoothed = smoothing != 0;
  
  if ( smoothed ) {
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
      
      controlPoint[0].x = p.x + m.x * smoothing;
      controlPoint[0].y = p.y + m.y * smoothing;
      
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
    
  } else {
    for ( int i = 0; i < dataPlots.count; i++) {
      if(i > 0) {
        [path addLineToPoint:[self getPointForIndex:i data:dataPlots withScale:scale]];
      } else {
        [path moveToPoint:[self getPointForIndex:i data:dataPlots withScale:scale]];
      }
    }
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


//- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event {
//  UITouch *aTouch = [touches anyObject];
//  CGPoint point = [aTouch locationInView:self];
//
//  NSLog(@"%f %f", point.x, point.y);
//}


- (void)nearestDataPointToPoint:(CGPoint)point selectedChartIndex:(NSInteger*)selectedChartIndex selectedPointIndex:(NSInteger*)selectedPointIndex {
  CGFloat minBound = [self minVerticalBound];
  CGFloat maxBound = [self maxVerticalBound];
  
  [self.chartData enumerateObjectsWithOptions:NSEnumerationReverse usingBlock:^(id obj, NSUInteger idx1, BOOL *stop1) {
    NSArray* dataPlots = obj[@"data"];
    [dataPlots enumerateObjectsUsingBlock:^(id obj, NSUInteger idx2, BOOL *stop2) {
      CGFloat s = self.axisHeight / (maxBound - minBound);
      CGPoint point = [self getPointForIndex:idx2 data:dataPlots withScale:s];
      NSLog(@"%.2f, %.2f", point.x, point.y);
      if ( false ) {
        *stop1 = YES;
        *stop2 = YES;
      }
    }];
  }];
}


@end
