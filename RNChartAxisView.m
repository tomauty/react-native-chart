//
//	RNChartPlotAxisView.m
//	RNChart
//
//	Created by Hyun Cho on 4/30/15.
//	Copyright (c) 2015 Facebook. All rights reserved.
//

#import "RNChartAxisView.h"
#import "RNChartView.h"

@interface RNChartAxisView ()

@end

@implementation RNChartAxisView

- (id)initWithParent:(RNChartView*)parent axis:(AxisType)axis {
	self = [self initWithFrame:CGRectZero];
	_parentChartView = parent;
	_axis = axis;

	_labelTextColor = parent.labelTextColor ? self.parentChartView.labelTextColor : [UIColor darkGrayColor];
	_labelFont = parent.labelFontSize ? [UIFont systemFontOfSize:self.parentChartView.labelFontSize] : [UIFont systemFontOfSize:14];

	self.backgroundColor = [UIColor clearColor];

	return self;
}


- (void)addLabels {
	if ( self.axis == AxisTypeY ) {

		CGFloat xOffset = 0.0;
		if ( self.parentChartView.yAxisTitle.length > 0 ) {
			UIFont* font = [UIFont systemFontOfSize:self.parentChartView.axisTitleFontSize];
			CGRect rect = [self.parentChartView.yAxisTitle boundingRectWithSize:CGSizeMake(self.frame.size.height, self.frame.size.width)
																										 options:NSStringDrawingUsesLineFragmentOrigin
																										 attributes:@{ NSFontAttributeName:font }
																										 context:nil];

			xOffset = rect.size.height;
			UILabel* axisTitleLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, self.frame.size.height, rect.size.height)];
			axisTitleLabel.text = self.parentChartView.yAxisTitle;
			axisTitleLabel.font = font;
			axisTitleLabel.textColor = self.parentChartView.axisTitleColor;
			axisTitleLabel.textAlignment = NSTextAlignmentCenter;

			CGAffineTransform rotation = CGAffineTransformMakeRotation(-M_PI * 0.5);
			CGAffineTransform translation = CGAffineTransformMakeTranslation((axisTitleLabel.bounds.size.height * 0.5)-(axisTitleLabel.bounds.size.width / 2),
																																			 (axisTitleLabel.bounds.size.width * 0.5) - (axisTitleLabel.bounds.size.height * 0.5));
			axisTitleLabel.transform = CGAffineTransformConcat(rotation, translation);

			[self addSubview:axisTitleLabel];
		}

		if (_parentChartView.showYAxisLabels) {
			for ( int i = 0; i < self.parentChartView.verticalGridStep; i++ ) {
				UILabel* label = [self createLabelForYAxis:i xOffset:xOffset];

				if ( label != nil ) {
					[self addSubview:label];
				}
			}
		}

	} else if ( self.axis == AxisTypeX ) {

		CGFloat y = 0.0;

		if (_parentChartView.showXAxisLabels) {
			for ( int i = 0; i < self.parentChartView.xLabels.count; i++ ) {
				UILabel* label = [self createLabelForXAxis:i];

				if ( label != nil ) {
					[self addSubview:label];
					y = MAX(y, label.frame.origin.y + label.frame.size.height);
				}
			}

			y += 2.0;
		}
		if ( self.parentChartView.xAxisTitle.length > 0 ) {
			UILabel* axisTitleLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, y, self.frame.size.width, self.frame.size.height - y)];
			axisTitleLabel.text = self.parentChartView.xAxisTitle;
			axisTitleLabel.font = [UIFont systemFontOfSize:self.parentChartView.axisTitleFontSize];
			axisTitleLabel.textColor = self.parentChartView.axisTitleColor;
			axisTitleLabel.textAlignment = NSTextAlignmentCenter;
			[self addSubview:axisTitleLabel];
		}
	}
}


- (UILabel*)createLabelForYAxis:(NSUInteger)index xOffset:(CGFloat)xOffset
{
	CGFloat minBound = [self.parentChartView minVerticalBound];
	CGFloat maxBound = [self.parentChartView maxVerticalBound];

	CGFloat axisHeight = self.frame.size.height;

	CGPoint p = CGPointMake(xOffset, axisHeight - (index + 1) * axisHeight / self.parentChartView.verticalGridStep);

	NSNumber *valueIndex = nil;
	valueIndex = [NSNumber numberWithFloat:minBound + (maxBound - minBound) / self.parentChartView.verticalGridStep * (index + 1)];

	NSNumberFormatter *nFormat = [[NSNumberFormatter alloc] init];
	[nFormat setNumberStyle:NSNumberFormatterDecimalStyle];
	[nFormat setMaximumFractionDigits:1];

	NSString* text = [NSString stringWithFormat:@"%@", [nFormat stringFromNumber:valueIndex]];

	if ( text == nil ) {
		return nil;
	}

	CGFloat labelHeight = 20;

	CGRect rect = CGRectMake(xOffset, p.y, self.frame.size.width - xOffset, 20);

	float width = [text boundingRectWithSize:rect.size
											options:NSStringDrawingUsesLineFragmentOrigin
											attributes:@{ NSFontAttributeName:self.labelFont }
											context:nil].size.width;

	UILabel* label = [[UILabel alloc] initWithFrame:CGRectMake(p.x, p.y - (labelHeight * 0.5), width + 2, labelHeight)];
	label.text = text;
	label.font = self.labelFont;
	label.textColor = self.labelTextColor;
	label.textAlignment = NSTextAlignmentCenter;

	return label;
}


- (UILabel*)createLabelForXAxis:(NSUInteger)index
{
	CGFloat scale = [self.parentChartView horizontalScale];
	NSString* text = self.parentChartView.xLabels[index];

	if( text == nil ) {
		return nil;
	}

	CGFloat padding = 2;
	CGFloat axisWidth = self.frame.size.width;

	NSUInteger horizontalGridStep = self.parentChartView.xLabels.count;
	CGFloat xOffset = (axisWidth / horizontalGridStep) * scale * 0.5;
	CGPoint p = CGPointMake((index * (axisWidth / horizontalGridStep) * scale) + xOffset, 0);

	CGRect rect = CGRectMake(0, 0, self.frame.size.width, 100);
	CGRect boundRect = [text boundingRectWithSize:rect.size
																				options:NSStringDrawingUsesLineFragmentOrigin
																		 attributes:@{ NSFontAttributeName:self.labelFont }
																				context:nil];
	CGFloat width = boundRect.size.width + padding;

	UILabel* label = [[UILabel alloc] initWithFrame:CGRectMake(p.x - (width*0.5), p.y, width, boundRect.size.height + padding)];
	label.text = text;
	label.font = self.labelFont;
	label.textColor = self.labelTextColor;

	return label;
}

@end
