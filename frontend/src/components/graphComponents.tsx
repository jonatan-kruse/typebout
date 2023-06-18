import { EndGameStats, GameInformation } from '@/socket/types'
import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Scatter
} from 'recharts'

interface SingleGraphProps {
  chosenEndgameStats: EndGameStats
  timeTicks: number[]
  wpmTicks: number[]
  minWpm: number
  maxWpm: number
  completionTimes: number[]
}

export const SingleGraph: React.FC<SingleGraphProps> = ({
  chosenEndgameStats,
  timeTicks,
  wpmTicks,
  minWpm,
  maxWpm,
  completionTimes
}) => {
  console.log(chosenEndgameStats.mistakeIndices)
  return (
    <ResponsiveContainer width="100%" height={250}>
      <ComposedChart data={chosenEndgameStats.graphData}>
        <XAxis
          dataKey="time"
          type="number"
          ticks={timeTicks}
          domain={[Math.min(...completionTimes), Math.max(...completionTimes)]}
        />
        <YAxis domain={[minWpm - 5, maxWpm + 5]} ticks={wpmTicks} dataKey="y" />
        <Tooltip />
        <CartesianGrid stroke="#70707010" />
        <Legend />
        <Scatter
          shape="triangle"
          legendType="triangle"
          fill="#ff0000"
          line={false}
          name="Mistake"
          data={chosenEndgameStats.graphData.map(({ wpm, time }, i) =>
            chosenEndgameStats.mistakeIndices.includes(i)
              ? { y: wpm, time }
              : { y: null, time }
          )}
        />
        <Line
          type="monotone"
          dataKey="wpm"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
          name="WPM"
        />
        <Line
          type="monotone"
          dataKey="rawWpm"
          stroke="#82ca9d60"
          strokeWidth={2}
          dot={false}
          name="Raw WPM"
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

interface MultiGraphProps {
  endGameStats: EndGameStats[]
  gameInfoArr: GameInformation[]
  timeTicks: number[]
  wpmTicks: number[]
  minWpm: number
  maxWpm: number
  completionTimes: number[]
}

export const MultiGraph: React.FC<MultiGraphProps> = ({
  endGameStats,
  gameInfoArr,
  timeTicks,
  wpmTicks,
  minWpm,
  maxWpm,
  completionTimes
}) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart>
        <XAxis
          dataKey="time"
          type="number"
          ticks={timeTicks}
          domain={[Math.min(...completionTimes), Math.max(...completionTimes)]}
        />
        <YAxis domain={[minWpm - 5, maxWpm + 5]} ticks={wpmTicks} />
        <Tooltip />
        <CartesianGrid stroke="#70707010" />
        <Legend />
        {endGameStats.map((data) => (
          <Line
            data={data.graphData}
            type="monotone"
            dataKey="wpm"
            stroke={
              gameInfoArr.find(
                (gameInfo) => gameInfo.username === data.username
              )?.color ?? '#82ca9d60'
            }
            strokeWidth={2}
            dot={false}
            name={data.username}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
