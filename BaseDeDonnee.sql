DROP IF EXISTS ;

CREATE DATABASE Projet_schema;
USE Projet_schema;

CREATE TABLE Classe(
    Id_Classe INT auto_increment PRIMARY KEY,
    Nom_Classe VARCHAR(20) NOT NULL,
    Effectif INTEGER NOT NULL
);


CREATE TABLE Matiere(
    Id_Matiere INT  auto_increment PRIMARY KEY,
    Nom_Matiere VARCHAR(20) 
);

CREATE TABLE Seance(
    Id_Conference INT auto_increment PRIMARY KEY,
    Id_Matiere INT,
    Id_Classe INT,
    Date_debut DATE NOT NULL,
    Date_fin DATE NOT NULL,
    Heure_debut time NOT NULL,
    Heure_fin time NOT NULL,
    Partage_ecran INT,
    Note INT,
    Qualite VARCHAR(20),
    PID INT,
    Nb_interaction INT,
    Constraint fk_Id_Classe FOREIGN KEY (Id_Classe) REFERENCES Classe(Id_Classe),
    Constraint fk_Id_Matiere FOREIGN KEY (Id_Matiere) REFERENCES Matiere(Id_Matiere)
);
CREATE TABLE Participant(
    id_Participant INT auto_increment PRIMARY KEY,
    Nb_Connexion_Deconnexion INT,
    Duree_Moyenne_Presence INT,
    Type_terminal VARCHAR(20),
    Adresse_mail VARCHAR(20),
    Localisation VARCHAR(20) 
);

CREATE TABLE Professeur(
    Id_Prof INT auto_increment PRIMARY KEY,
    NomProf VARCHAR(10) NOT NULL,
    PrenomProf VARCHAR(20) NOT NULL,
    Login VARCHAR(20),
    Password VARCHAR(20),
    FOREIGN KEY (Id_Prof) REFERENCES Participant(Id_Participant)
);

CREATE TABLE Eleve(
    Id_Eleve INT auto_increment PRIMARY KEY,
    NomEl VARCHAR(10) NOT NULL,
    PrenomEl VARCHAR(20) NOT NULL,
    FOREIGN KEY (Id_Eleve) REFERENCES Participant(Id_Participant)
);