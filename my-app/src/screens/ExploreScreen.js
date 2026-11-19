import React, { useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  background: '#090B16',
  surface: '#121626',
  elevated: '#191E30',
  text: '#F6F4FF',
  muted: '#969BB3',
  purple: '#A78BFA',
  pink: '#FB7185',
  border: 'rgba(255,255,255,0.09)',
};

const GENRES = [
  'Todos',
  'Pop',
  'Indie',
  'Hip-hop',
  'R&B',
  'Eletrônica',
  'Rock',
  'MPB',
  'Jazz',
  'Funk',
];

const RELEASES = [
  {
    id: '1',
    title: 'The Rise and Fall of a Midwest Princess',
    artist: 'Chappell Roan',
    type: 'Álbum',
    genre: 'Pop',
    cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=700&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Charm',
    artist: 'Clairo',
    type: 'Álbum',
    genre: 'Indie',
    cover: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=700&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'GNX',
    artist: 'Kendrick Lamar',
    type: 'Álbum',
    genre: 'Hip-hop',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=700&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Sugar Honey Iced Tea',
    artist: 'Latto',
    type: 'Álbum',
    genre: 'R&B',
    cover: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=700&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'BRAT',
    artist: 'Charli XCX',
    type: 'Álbum',
    genre: 'Eletrônica',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=700&auto=format&fit=crop',
  },
  {
    id: '6',
    title: 'No Name',
    artist: 'Jack White',
    type: 'Álbum',
    genre: 'Rock',
    cover: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=700&auto=format&fit=crop',
  },
  {
    id: '7',
    title: 'Caju',
    artist: 'Liniker',
    type: 'Álbum',
    genre: 'MPB',
    cover: 'https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=700&auto=format&fit=crop',
  },
  {
    id: '8',
    title: 'Imaginal Disk',
    artist: 'Magdalena Bay',
    type: 'Álbum',
    genre: 'Indie',
    cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=700&auto=format&fit=crop',
  },
  {
    id: '9',
    title: 'Short n’ Sweet',
    artist: 'Sabrina Carpenter',
    type: 'Álbum',
    genre: 'Pop',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=700&auto=format&fit=crop',
  },
  {
    id: '10',
    title: 'Espresso',
    artist: 'Sabrina Carpenter',
    type: 'Single',
    genre: 'Pop',
    cover: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=700&auto=format&fit=crop',
  },
  {
    id: '11',
    title: 'The Secret of Us (Deluxe)',
    artist: 'Gracie Abrams',
    type: 'EP',
    genre: 'Pop',
    cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=700&auto=format&fit=crop',
  },
  {
    id: '12',
    title: 'Caju (Deluxe)',
    artist: 'Liniker',
    type: 'EP',
    genre: 'MPB',
    cover: 'https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=700&auto=format&fit=crop',
  },
];

const FEATURED_RELEASE = RELEASES[4];

function ReleaseCard({ release }) {
  return (
    <View style={styles.releaseCard}>
      <View style={styles.coverWrap}>
        <Image source={{ uri: release.cover }} style={styles.cover} contentFit="cover" />
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{release.type}</Text>
        </View>
      </View>
      <Text style={styles.releaseTitle} numberOfLines={1}>{release.title}</Text>
      <Text style={styles.releaseArtist} numberOfLines={1}>{release.artist}</Text>
      <View style={styles.genreLabel}>
        <View style={styles.genreDot} />
        <Text style={styles.genreLabelText}>{release.genre}</Text>
      </View>
    </View>
  );
}

export default function ExploreScreen({ onHomePress }) {
  const genreScrollRef = useRef(null);
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [search, setSearch] = useState('');
  const [scrollMetrics, setScrollMetrics] = useState({
    offset: 0,
    viewport: 0,
    content: 0,
  });

  const filteredReleases = useMemo(() => {
    const query = search.trim().toLowerCase();
    return RELEASES.filter((release) => {
      const matchesGenre = selectedGenre === 'Todos' || release.genre === selectedGenre;
      const matchesSearch = !query
        || `${release.title} ${release.artist} ${release.genre}`.toLowerCase().includes(query);

      return matchesGenre && matchesSearch;
    });
  }, [search, selectedGenre]);

  const canScrollLeft = scrollMetrics.offset > 4;
  const canScrollRight = scrollMetrics.offset + scrollMetrics.viewport < scrollMetrics.content - 4;

  const moveGenres = (direction) => {
    const maxOffset = Math.max(0, scrollMetrics.content - scrollMetrics.viewport);
    const nextOffset = Math.max(
      0,
      Math.min(maxOffset, scrollMetrics.offset + direction * 150),
    );

    genreScrollRef.current?.scrollTo({ x: nextOffset, animated: true });
  };

  const updateScrollMetrics = (updates) => {
    setScrollMetrics((current) => ({ ...current, ...updates }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.pageContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topBar}>
            <View>
              <View style={styles.brandRow}>
                <Image
                  source={require('../../assets/musicfy-icon.png')}
                  style={styles.brandIcon}
                  contentFit="contain"
                />
                <Text style={styles.brand}>MUSICFY <Text style={styles.brandDot}>•</Text></Text>
              </View>
              <Text style={styles.eyebrow}>SEU PRÓXIMO SOM FAVORITO</Text>
            </View>
            <View style={styles.avatar}>
              <Ionicons name="headset" size={18} color={COLORS.text} />
            </View>
          </View>

          <Text style={styles.pageTitle}>Explore</Text>
          <Text style={styles.pageSubtitle}>Novos sons, novas histórias.</Text>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={19} color={COLORS.muted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Artista, lançamento ou gênero"
              placeholderTextColor={COLORS.muted}
              style={styles.searchInput}
              returnKeyType="search"
              accessibilityLabel="Buscar lançamentos"
            />
            {search.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearch('')}
                accessibilityRole="button"
                accessibilityLabel="Limpar busca"
                hitSlop={8}
              >
                <Ionicons name="close-circle" size={19} color={COLORS.muted} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.featuredCard}>
            <Image
              source={{ uri: FEATURED_RELEASE.cover }}
              style={styles.featuredImage}
              contentFit="cover"
            />
            <LinearGradient
              colors={['rgba(9,11,22,0.04)', 'rgba(9,11,22,0.42)', 'rgba(9,11,22,0.96)']}
              locations={[0, 0.43, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.featuredContent}>
              <View style={styles.featuredTag}>
                <View style={styles.featuredDot} />
                <Text style={styles.featuredTagText}>NO RADAR</Text>
              </View>
              <Text style={styles.featuredTitle}>BRAT</Text>
              <Text style={styles.featuredArtist}>Charli XCX · Eletrônica</Text>
            </View>
            <View style={styles.featuredIcon}>
              <Ionicons name="sparkles" size={18} color={COLORS.text} />
            </View>
          </View>

          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionTitle}>Escolha seu clima</Text>
              <Text style={styles.sectionCaption}>Toque em um gênero para filtrar</Text>
            </View>
            <View style={styles.arrows}>
              <TouchableOpacity
                style={[styles.arrowButton, !canScrollLeft && styles.arrowDisabled]}
                onPress={() => moveGenres(-1)}
                disabled={!canScrollLeft}
                accessibilityRole="button"
                accessibilityLabel="Ver gêneros anteriores"
              >
                <Ionicons name="chevron-back" size={16} color={canScrollLeft ? COLORS.text : COLORS.muted} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.arrowButton, !canScrollRight && styles.arrowDisabled]}
                onPress={() => moveGenres(1)}
                disabled={!canScrollRight}
                accessibilityRole="button"
                accessibilityLabel="Ver mais gêneros"
              >
                <Ionicons name="chevron-forward" size={16} color={canScrollRight ? COLORS.text : COLORS.muted} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.genreRow}>
            <ScrollView
              ref={genreScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.genreList}
              onLayout={(event) => updateScrollMetrics({ viewport: event.nativeEvent.layout.width })}
              onContentSizeChange={(width) => updateScrollMetrics({ content: width })}
              onScroll={(event) => updateScrollMetrics({ offset: event.nativeEvent.contentOffset.x })}
              scrollEventThrottle={16}
              accessibilityLabel="Gêneros musicais"
            >
              {GENRES.map((genre) => {
                const isSelected = selectedGenre === genre;
                return (
                  <TouchableOpacity
                    key={genre}
                    style={[styles.genreChip, isSelected && styles.genreChipSelected]}
                    onPress={() => setSelectedGenre(genre)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text style={[styles.genreChipText, isSelected && styles.genreChipTextSelected]}>
                      {genre}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.resultsHeading}>
            <View>
              <Text style={styles.sectionTitle}>Lançamentos</Text>
              <Text style={styles.sectionCaption}>
                {filteredReleases.length} {filteredReleases.length === 1 ? 'descoberta' : 'descobertas'}
                {selectedGenre !== 'Todos' ? ` em ${selectedGenre}` : ''}
              </Text>
            </View>
          </View>

          {filteredReleases.length > 0 ? (
            <View style={styles.releaseGrid}>
              {filteredReleases.map((release) => (
                <ReleaseCard key={release.id} release={release} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="musical-notes-outline" size={28} color={COLORS.purple} />
              <Text style={styles.emptyTitle}>Nada por aqui ainda</Text>
              <Text style={styles.emptyText}>Tente outro gênero ou termo de busca.</Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedGenre('Todos');
                  setSearch('');
                }}
                accessibilityRole="button"
              >
                <Text style={styles.clearFilters}>Limpar filtros</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <View style={styles.bottomDock}>
          <TouchableOpacity
            style={styles.dockButton}
            onPress={onHomePress}
            accessibilityRole="button"
            accessibilityLabel="Ir para início"
          >
            <Ionicons name="home-outline" size={21} color={COLORS.muted} />
            <Text style={styles.dockLabel}>Início</Text>
          </TouchableOpacity>
          <View style={styles.dockButton}>
            <Ionicons name="compass" size={21} color={COLORS.purple} />
            <Text style={[styles.dockLabel, styles.activeDockLabel]}>Explorar</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  pageContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 124,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  brandIcon: {
    width: 25,
    height: 25,
  },
  brand: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  brandDot: {
    color: COLORS.pink,
  },
  eyebrow: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginTop: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    color: COLORS.text,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -1.2,
  },
  pageSubtitle: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 5,
    marginBottom: 19,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    marginBottom: 22,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 0,
    color: COLORS.text,
    fontSize: 13,
  },
  featuredCard: {
    height: 204,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: COLORS.elevated,
    marginBottom: 28,
  },
  featuredImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.86,
  },
  featuredContent: {
    position: 'absolute',
    left: 18,
    bottom: 17,
  },
  featuredTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(9,11,22,0.65)',
    marginBottom: 8,
  },
  featuredDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.pink,
    marginRight: 6,
  },
  featuredTagText: {
    color: COLORS.text,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  featuredTitle: {
    color: COLORS.text,
    fontSize: 29,
    lineHeight: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  featuredArtist: {
    color: 'rgba(246,244,255,0.82)',
    fontSize: 12,
    marginTop: 3,
  },
  featuredIcon: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: 'rgba(9,11,22,0.55)',
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionCaption: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },
  arrows: {
    flexDirection: 'row',
    gap: 6,
  },
  arrowButton: {
    width: 29,
    height: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  arrowDisabled: {
    opacity: 0.42,
  },
  genreRow: {
    marginHorizontal: -20,
    marginBottom: 26,
  },
  genreList: {
    paddingHorizontal: 20,
    gap: 7,
  },
  genreChip: {
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  genreChipSelected: {
    borderColor: COLORS.purple,
    backgroundColor: 'rgba(167,139,250,0.18)',
  },
  genreChipText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  genreChipTextSelected: {
    color: '#D5C8FF',
  },
  resultsHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  releaseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  releaseCard: {
    width: '48%',
    marginBottom: 19,
  },
  coverWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: COLORS.elevated,
    marginBottom: 9,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  typeBadge: {
    position: 'absolute',
    left: 8,
    top: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(9,11,22,0.78)',
  },
  typeText: {
    color: COLORS.text,
    fontSize: 9,
    fontWeight: '800',
  },
  releaseTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '800',
  },
  releaseArtist: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 3,
  },
  genreLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  genreDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.purple,
    marginRight: 6,
  },
  genreLabelText: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 12,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  clearFilters: {
    color: COLORS.purple,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 15,
  },
  bottomDock: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    backgroundColor: 'rgba(18,22,38,0.96)',
  },
  dockButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 78,
    gap: 3,
  },
  dockLabel: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '600',
  },
  activeDockLabel: {
    color: COLORS.purple,
    fontWeight: '800',
  },
});
