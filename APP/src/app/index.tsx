import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.mark}>
          <Text style={styles.markText}>B</Text>
        </View>
        <Text style={styles.title}>비비디</Text>
        <Text style={styles.subtitle}>우리의 결혼 준비, 차근차근 함께해요.</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>결혼식까지</Text>
          <Text style={styles.cardTitle}>소중한 일정을 준비해 보세요</Text>
          <Text style={styles.cardDescription}>
            예식장부터 스튜디오, 드레스, 메이크업까지{`\n`}한곳에서 관리할 수 있어요.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF9F7',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  mark: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#E96D64',
    marginBottom: 20,
  },
  markText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  title: {
    color: '#2F2525',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    color: '#756969',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  card: {
    marginTop: 44,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1E4E0',
  },
  cardLabel: {
    color: '#E96D64',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  cardTitle: {
    color: '#2F2525',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  cardDescription: {
    color: '#756969',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
});
