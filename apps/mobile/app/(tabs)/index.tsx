import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Card } from '@/components/Card';
import { SyncStatusCard } from '@/components/SyncStatusCard';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function HomeScreen() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.getAnalyticsOverview().then(setData);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
        </View>

        <SyncStatusCard status="synced" lastSyncedText="Just now" />

        <Text style={styles.sectionTitle}>Overview</Text>
        <Card style={styles.metricCard}>
          <Text style={styles.metricLabel}>Performance Score</Text>
          <Text style={styles.metricValue}>{data?.performanceScore || '--'}</Text>
        </Card>

        <View style={styles.row}>
          <Card style={[styles.metricCard, styles.halfCard]}>
            <Text style={styles.metricLabel}>Coverage</Text>
            <Text style={styles.metricValue}>{data?.coverage || '--'}</Text>
          </Card>
          <Card style={[styles.metricCard, styles.halfCard]}>
            <Text style={styles.metricLabel}>Savings</Text>
            <Text style={styles.metricValue}>{data?.savings || '--'}</Text>
          </Card>
        </View>

        {/* TODO: Add 'how this helped' summary panel and more detailed metrics */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    marginTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.dark.text,
    marginTop: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  metricCard: {
    marginBottom: 16,
  },
  halfCard: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.dark.tint,
  },
});
