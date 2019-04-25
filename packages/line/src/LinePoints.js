/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { TransitionMotion, spring } from 'react-motion'
import { motionPropTypes, getLabelGenerator, DotsItem, useTheme } from '@nivo/core'

const LinePoints = memo(
    ({
        points,
        symbol,
        size,
        borderWidth,
        enableLabel,
        label,
        labelFormat,
        labelYOffset,
        animate,
        motionStiffness,
        motionDamping,
    }) => {
        const theme = useTheme()
        const getLabel = getLabelGenerator(label, labelFormat)

        const mappedPoints = points.map(point => {
            const mappedPoint = {
                id: point.id,
                x: point.x,
                y: point.y,
                datum: point.data,
                fill: point.color,
                stroke: point.borderColor,
                label: enableLabel ? getLabel(point) : null,
            }

            return mappedPoint
        })

        if (animate !== true) {
            return (
                <g>
                    {mappedPoints.map(point => (
                        <DotsItem
                            key={point.id}
                            x={point.x}
                            y={point.y}
                            datum={point.datum}
                            symbol={symbol}
                            size={size}
                            color={point.fill}
                            borderWidth={borderWidth}
                            borderColor={point.stroke}
                            label={point.label}
                            labelYOffset={labelYOffset}
                            theme={theme}
                        />
                    ))}
                </g>
            )
        }
        const springConfig = {
            motionDamping,
            motionStiffness,
        }

        return (
            <TransitionMotion
                styles={mappedPoints.map(point => {
                    return {
                        key: point.id,
                        data: point,
                        style: {
                            x: spring(point.x, springConfig),
                            y: spring(point.y, springConfig),
                            size: spring(size, springConfig),
                        },
                    }
                })}
            >
                {interpolatedStyles => (
                    <g>
                        {interpolatedStyles.map(({ key, style, data: point }) => (
                            <DotsItem
                                key={key}
                                {...style}
                                symbol={symbol}
                                datum={point.datum}
                                color={point.fill}
                                borderWidth={borderWidth}
                                borderColor={point.stroke}
                                label={point.label}
                                labelYOffset={labelYOffset}
                                theme={theme}
                            />
                        ))}
                    </g>
                )}
            </TransitionMotion>
        )
    }
)

LinePoints.displayName = 'LinePoints'
LinePoints.propTypes = {
    lines: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
        })
    ),

    symbol: PropTypes.func,
    size: PropTypes.number.isRequired,
    color: PropTypes.func.isRequired,
    borderWidth: PropTypes.number.isRequired,
    borderColor: PropTypes.func.isRequired,

    enableLabel: PropTypes.bool.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    labelFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    labelYOffset: PropTypes.number,

    ...motionPropTypes,
}

LinePoints.defaultProps = {
    enableLabel: false,
    label: 'y',
}

export default LinePoints