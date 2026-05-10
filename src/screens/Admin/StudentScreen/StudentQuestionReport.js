import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';

import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Svg, { Line, Circle, Text as SvgText, Rect } from 'react-native-svg';

import {
  getStudentQuestionReport,
  getEEGDelta,
  getEEGTheta,
  getEEGAlpha,
  getEEGBeta,
  getEEGGamma,
  getSelfReport,
  getPPGSingle,
} from '../../../api/reportApi';

const screenWidth = Dimensions.get('window').width;

// =============================================
// EEG ALPHA GRAPH WITH BP OVERLAY
// =============================================
const AlphaChartWithBP = ({ alphaData, bpb, bpm, bpa }) => {
  if (!alphaData?.time || !alphaData?.alpha) return null;

  const values = alphaData.alpha;
  const time = alphaData.time;

  const chartWidth = screenWidth - 60;
  const chartHeight = 180;

  // react-native-chart-kit inner padding (approximate)
  const leftPad = 55;
  const rightPad = 20;
  const topPad = 16;
  const bottomPad = 40;

  const plotWidth = chartWidth - leftPad - rightPad;
  const plotHeight = chartHeight - topPad - bottomPad;

  const totalPoints = values.length;

  // BP markers at 3 positions:
  // Start = index 0
  // Mid   = index middle
  // End   = index last
  const startIdx = 0;
  const midIdx = Math.floor(totalPoints / 2);
  const endIdx = totalPoints - 1;

  const getX = (idx) => leftPad + (idx / (totalPoints - 1)) * plotWidth;

  const startX = getX(startIdx);
  const midX = getX(midIdx);
  const endX = getX(endIdx);

  // BP label configs
  const bpMarkers = [
    { x: startX, label: 'Start', bp: bpb ?? 'N/A', color: '#378ADD' },
    { x: midX,   label: 'Mid',   bp: bpm ?? 'N/A', color: '#7F77DD' },
    { x: endX,   label: 'End',   bp: bpa ?? 'N/A', color: '#1D9E75' },
  ];

  const labels = time.map((t, i) =>
    i % 20 === 0 ? `${Math.round(t)}s` : '',
  );

  return (
    <View style={{ marginBottom: 25 }}>
      <Text style={styles.chartTitle}>ALPHA</Text>

      {/* Chart + SVG overlay stacked */}
      <View style={{ width: chartWidth, height: chartHeight }}>

        {/* Base LineChart */}
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: values,
                color: () => '#f59e0b',
                strokeWidth: 2,
              },
            ],
          }}
          width={chartWidth}
          height={chartHeight}
          withDots={false}
          withInnerLines={true}
          withOuterLines={true}
          withShadow={false}
          chartConfig={{
            backgroundGradientFrom: '#f9f9f9',
            backgroundGradientTo: '#f9f9f9',
            decimalPlaces: 2,
            color: () => '#f59e0b',
            labelColor: () => '#555',
            propsForBackgroundLines: {
              stroke: '#ccc',
              strokeDasharray: '5,5',
            },
          }}
          bezier
          style={{ borderRadius: 10 }}
        />

        {/* SVG overlay — BP vertical lines + labels */}
        <Svg
          width={chartWidth}
          height={chartHeight}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          pointerEvents="none"
        >
          {bpMarkers.map((marker, i) => (
            <React.Fragment key={i}>

              {/* Vertical dashed line */}
              <Line
                x1={marker.x}
                y1={topPad}
                x2={marker.x}
                y2={topPad + plotHeight}
                stroke={marker.color}
                strokeWidth="1.5"
                strokeDasharray="5,3"
              />

              {/* Top circle dot */}
              <Circle
                cx={marker.x}
                cy={topPad + 2}
                r={4}
                fill={marker.color}
              />

              {/* Label pill background */}
              <Rect
                x={marker.x - 22}
                y={topPad + 8}
                width={44}
                height={30}
                rx={6}
                fill={marker.color}
                opacity={0.92}
              />

              {/* Phase name e.g. "Start" */}
              <SvgText
                x={marker.x}
                y={topPad + 19}
                fontSize="8"
                fill="#fff"
                textAnchor="middle"
                fontWeight="bold"
              >
                {marker.label}
              </SvgText>

              {/* BP value e.g. "120/80" */}
              <SvgText
                x={marker.x}
                y={topPad + 30}
                fontSize="7.5"
                fill="#fff"
                textAnchor="middle"
              >
                {marker.bp}
              </SvgText>

            </React.Fragment>
          ))}
        </Svg>
      </View>

      {/* BP Legend below graph */}
      <View style={alphaStyles.legendRow}>
        {bpMarkers.map((m, i) => (
          <View key={i} style={alphaStyles.legendItem}>
            <View style={[alphaStyles.legendDot, { backgroundColor: m.color }]} />
            <Text style={alphaStyles.legendText}>
              {m.label}: <Text style={{ fontWeight: 'bold' }}>{m.bp}</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const alphaStyles = StyleSheet.create({
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: '#444',
  },
});

// =============================================
// MAIN SCREEN
// =============================================
export default function StudentQuestionReport({ navigation, route }) {
  const { sid, sessionId, qid } = route.params;

  const [question, setQuestion] = useState(null);
  const [eeg, setEeg] = useState({});
  const [ppg, setPpg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [graphLoading, setGraphLoading] = useState(true);
  const [selfReport, setSelfReport] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const q = await getStudentQuestionReport(sid, qid);
      setQuestion(q);
      setLoading(false);

      const self = await getSelfReport(sessionId);
      setSelfReport(self);

      const delta = await getEEGDelta(sid, sessionId, qid);
      const theta = await getEEGTheta(sid, sessionId, qid);
      const alpha = await getEEGAlpha(sid, sessionId, qid);
      const beta = await getEEGBeta(sid, sessionId, qid);
      const gamma = await getEEGGamma(sid, sessionId, qid);

      setEeg({ delta, theta, alpha, beta, gamma });

      const ppgData = await getPPGSingle(sid, sessionId, qid);
      setPpg(ppgData);
    } catch (err) {
      console.log('Error:', err);
    } finally {
      setGraphLoading(false);
    }
  };

  // Normal chart for delta, theta, beta, gamma
  const renderChart = (data, label, color) => {
    if (!data?.time || !data[label]) return null;

    const values = data[label];
    const time = data.time;
    const labels = time.map((t, i) =>
      i % 20 === 0 ? `${Math.round(t)}s` : '',
    );

    return (
      <View style={{ marginBottom: 25 }}>
        <Text style={styles.chartTitle}>{label.toUpperCase()}</Text>
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: values,
                color: () => color,
                strokeWidth: 2,
              },
            ],
          }}
          width={screenWidth - 60}
          height={180}
          withDots={false}
          withInnerLines={true}
          withOuterLines={true}
          withShadow={false}
          chartConfig={{
            backgroundGradientFrom: '#f9f9f9',
            backgroundGradientTo: '#f9f9f9',
            decimalPlaces: 2,
            color: () => color,
            labelColor: () => '#555',
            propsForBackgroundLines: {
              stroke: '#ccc',
              strokeDasharray: '5,5',
            },
          }}
          bezier
          style={{ borderRadius: 10 }}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* BACK */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>‹ Back</Text>
      </TouchableOpacity>

      {/* LOGO */}
      <Image
        source={require('../../../../assets/icons/CodeMide.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Question Report</Text>

      {/* QUESTION */}
      <View style={styles.card}>
        <Text style={styles.question}>
          {question?.description || 'No Question Found'}
        </Text>
      </View>

      {/* OVERALL REPORT */}
      <View style={styles.card}>
        <Text style={styles.heading}>Overall Question Report</Text>

        <Text style={styles.subHeading}>Complete time</Text>
        <Text> {question?.time_taken || '0'} sec</Text>

        <Text style={styles.subHeading}>Stress Index</Text>
        <Text>
          {question?.SI !== undefined && question?.SI !== null
            ? question.SI.toFixed(3)
            : 'N/A'}
        </Text>

        <Text style={styles.subHeading}>Blood Pressure</Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>Start Question (BP): </Text>
          {question?.bpb ?? 'N/A'}
        </Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>Mid Question (BP): </Text>
          {question?.bpm ?? 'N/A'}
        </Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>End Question (BP): </Text>
          {question?.bpa ?? 'N/A'}
        </Text>

        <Text style={styles.subHeading}>Heart Rate Variability (PPG)</Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>HR: </Text>
          {question?.HR != null ? Math.round(question.HR) + ' bpm' : 'N/A'}
        </Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>RMSSD: </Text>
          {question?.RMSSD != null ? Math.round(question.RMSSD) + ' ms' : 'N/A'}
        </Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>SDNN: </Text>
          {question?.SDNN != null ? Math.round(question.SDNN) + ' ms' : 'N/A'}
        </Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>pNN50: </Text>
          {question?.pNN50 != null ? Math.round(question.pNN50) + ' %' : 'N/A'}
        </Text>

        <Text style={styles.subHeading}>Predicted Stress Level</Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>Final Stress Level: </Text>
          {question?.stress_level == 0
            ? 'Low'
            : question?.stress_level == 1
            ? 'Medium'
            : question?.stress_level == 2
            ? 'High'
            : 'N/A'}
        </Text>

        <Text style={styles.subHeading}>Answer</Text>
        <Text>{question?.Answers ?? 'N/A'}</Text>

        <Text style={styles.subHeading}>ChatGPT Index</Text>
        <Text>{question?.gptindex === 1 ? 'Used' : 'Not Used'}</Text>

        <Text style={styles.note}>
          Stress is indicated by higher heart rate, lower RMSSD/SDNN, and
          increased EEG stress index (SI).
        </Text>
      </View>

      {/* EEG BANDS */}
      <View style={styles.card}>
        <Text style={styles.heading}>EEG Individual Bands</Text>

        {graphLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <>
            {/* Delta, Theta — normal charts */}
            {renderChart(eeg.delta, 'delta', '#3b82f6')}
            {renderChart(eeg.theta, 'theta', '#10b981')}

            {/* ✅ ALPHA — special chart with BP overlay */}
            <AlphaChartWithBP
              alphaData={eeg.alpha}
              bpb={question?.bpb}
              bpm={question?.bpm}
              bpa={question?.bpa}
            />

            {/* Beta, Gamma — normal charts */}
            {renderChart(eeg.beta, 'beta', '#ef4444')}
            {renderChart(eeg.gamma, 'gamma', '#8b5cf6')}
          </>
        )}
      </View>

      {/* PPG GRAPH */}
      <View style={styles.card}>
        <Text style={styles.heading}>PPG Graph (Heart Features)</Text>

        {ppg?.HR?.length > 0 ? (
          (() => {
            const clean = arr =>
              arr.map(v => (isNaN(v) || v === null ? 0 : Number(v)));

            const time = ppg.time || [];
            const hr = ppg.HR || [];
            const sdnn = ppg.SDNN || [];
            const rmssd = ppg.RMSSD || [];
            const pnn50 = ppg.pNN50 || [];

            const minLength = Math.min(
              time.length, hr.length, sdnn.length, rmssd.length, pnn50.length,
            );

            const safeTime  = time.slice(0, minLength);
            const safeHR    = clean(hr.slice(0, minLength));
            const safeSDNN  = clean(sdnn.slice(0, minLength));
            const safeRMSSD = clean(rmssd.slice(0, minLength));
            const safePNN50 = clean(pnn50.slice(0, minLength));

            const reduce = arr => {
              const step = Math.ceil(arr.length / 50);
              return arr.filter((_, i) => i % step === 0);
            };

            const finalTime  = reduce(safeTime);
            const finalHR    = reduce(safeHR);
            const finalSDNN  = reduce(safeSDNN);
            const finalRMSSD = reduce(safeRMSSD);
            const finalPNN50 = reduce(safePNN50);

            const step = Math.ceil(finalTime.length / 8);
            const labels = finalTime.map((t, i) =>
              i % step === 0 ? `${Math.round(t)}s` : '',
            );

            return (
              <LineChart
                data={{
                  labels: labels,
                  datasets: [
                    { data: finalHR,    color: () => '#ff0000' },
                    { data: finalSDNN,  color: () => '#00bcd4' },
                    { data: finalRMSSD, color: () => '#4caf50' },
                    { data: finalPNN50, color: () => '#9c27b0' },
                  ],
                  legend: ['HR', 'SDNN', 'RMSSD', 'pNN50'],
                }}
                width={screenWidth - 60}
                height={200}
                withDots={false}
                chartConfig={{
                  backgroundGradientFrom: '#f9f9f9',
                  backgroundGradientTo: '#f9f9f9',
                  decimalPlaces: 2,
                  color: () => '#000',
                  labelColor: () => '#555',
                }}
                bezier
                style={{ borderRadius: 10 }}
              />
            );
          })()
        ) : (
          <Text style={styles.noData}>No PPG Data</Text>
        )}
      </View>

      <View style={{ marginTop: 10, height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#48D1E4',
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#48D1E4',
  },
  back: {
    color: '#fff',
    fontSize: 16,
  },
  logo: {
    width: 70,
    height: 70,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
  },
  question: {
    textAlign: 'left',
    color: '#000000',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#48D1E4',
  },
  subHeading: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#48D1E4',
  },
  chartTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  note: {
    marginTop: 8,
    fontSize: 12,
    color: 'gray',
  },
  noData: {
    color: '#999',
    textAlign: 'center',
    marginVertical: 10,
  },
});
