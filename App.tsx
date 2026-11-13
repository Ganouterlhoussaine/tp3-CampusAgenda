import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

function placesRestantes(e: Evenement): number {
  return (
   Math.max(0, e.capacite - e.inscrits) )
}

function statutEvenement(e: Evenement): string {
  const places = placesRestantes(e);
  if (places === 0) {
    return "Complet";
  } else if (places <= 3) {
    return "Presque complet";
  } else {
    return "Ouvert";
  }
}

const totalEvenements = evenements.length;
const evenementsComplets = evenements.filter((e) => placesRestantes(e) === 0).length;
const evenementsDisponibles = evenements.filter((e) => placesRestantes(e) > 0).length;
const totalPlaces = evenements.reduce((total, e) => total + placesRestantes(e), 0);

const ateliersDisponibles = evenements.filter( (e) => e.categorie === "Atelier" && placesRestantes(e) > 0 );

type BadgeEtatProps = { statut: string };
function BadgeEtat({ statut }: BadgeEtatProps) {
  let couleur = "green";

  if (statut === "Complet") {
    couleur = "red";
  } else if (statut === "Presque complet") {
    couleur = "orange";
  }

  return (
    <View style={{ backgroundColor: couleur, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
      <Text style={{ fontSize: 12, fontWeight: "bold", color: "#FFF" }}>{statut}</Text>
    </View>
  );
}

type CarteEvenementProps = { evenement: Evenement };
function CarteEvenement({ evenement }: CarteEvenementProps) {
  const places = placesRestantes(evenement);
  const statut = statutEvenement(evenement);

  return (
    <View style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{evenement.titre}</Text>
        <BadgeEtat statut={statut} />
      </View>
      <Text style={styles.category}>{evenement.categorie}</Text> 
      <Text style={styles.places}>{places} places libres</Text>
    </View>
  );
}

type BlocStatistiqueProps = { titre: string; valeur: number };
function BlocStatistique({ titre, valeur }: BlocStatistiqueProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{valeur}</Text>
      <Text style={styles.statTitle}>{titre}</Text>
    </View>
  );
}

const mode: "tous" | "ateliers" = "ateliers";

export default function App() {
  const evenementsAffiches = mode === "tous" ? evenements : ateliersDisponibles;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>        CampusAgenda</Text>
      <Text style={styles.subtitle}>                   Evenements du campus</Text>
      
      <View style={styles.statsContainer}>
        <BlocStatistique titre="Événements" valeur={totalEvenements} />
        <BlocStatistique titre="Événements complets" valeur={evenementsComplets} />
        <BlocStatistique titre="Événements disponibles" valeur={evenementsDisponibles} />
        <BlocStatistique titre="Places restantes" valeur={totalPlaces} />
      </View>
      
      <Text style={styles.sectionTitle}>
        {mode === "tous" ? "Tous les événements" : "Ateliers disponibles"}
      </Text>
     
      <FlatList
        data={evenementsAffiches}
        renderItem={({ item }) => <CarteEvenement evenement={item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucun événement disponible pour le moment.</Text>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
        style={styles.listStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 20, paddingTop: 55 },
  header: { fontSize: 28, fontWeight: "bold", color: "#000000" },
  subtitle: { fontSize: 15, color: "#64748B", marginTop: 5, marginBottom: 20 },
  statsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20 },
  statCard: { backgroundColor: "#FFFFFF", width: "48%", padding: 15, borderRadius: 12, marginBottom: 12, elevation: 2 },
  statNumber: { fontSize: 25, fontWeight: "bold", color: "#fd0000" },
  statTitle: { fontSize: 12, color: "#64748B", marginTop: 5 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#1E293B", marginBottom: 15 },
  listStyle: { flex: 1 },
  eventCard: { backgroundColor: "#FFFFFF", padding: 16, borderRadius: 14, marginBottom: 12, elevation: 2 },
  eventHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 },
  eventTitle: { fontSize: 16, fontWeight: "bold", color: "#1E293B", flexShrink: 1 },
  category: { color: "#64748B", marginTop: 8 },
  places: { color: "#2563EB", fontWeight: "600", marginTop: 8 },
  emptyText: { textAlign: "center", color: "#64748B", marginTop: 30, fontSize: 15 },
});