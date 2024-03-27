const jwt = require("jsonwebtoken");
const Saison=require("../models/saisonModel")
const Candidats = require("../models/candidatModel");
const CandidatsVerif = require("../models/candidatMailVerifModel");
const sendEmail = require("../utils/sendEmail");
const Audition = require("../models/auditionModel");
const Membre=require("../models/membreModel")
const DateRange = require("../models/dateRangeModel");
const path = require("path");
const generatePassword = require('generate-password')
const bcrypt=require("bcrypt")
const fs = require('fs');
// const path = require('path');

const accepterCandidatParAudition = async (req, res) => {
  try {
    // Chemin vers le fichier de la charte stocké sur le serveur
    const chartePath = path.join(__dirname, '..', 'uploads', 'charte.pdf');
    const charteBuffer = fs.readFileSync(chartePath);

    // Votre logique existante pour récupérer les candidats et envoyer les emails
    const auditions = await Audition.find({"candidatsInfo": { $not: { $size: 0 } }}).populate('candidats');
    for (const audition of auditions) {
      for (let i = 0; i < audition.candidats.length; i++) {
        const candidat = audition.candidats[i];
        const candidatInfo = audition.candidatsInfo[i];
        if (candidatInfo.decision === 'Retenu') {
          const lienConfirm = `http://localhost:8000/api/candidats/confirm/${candidat._id}`;
          const sujetEmail = "Acceptation de votre candidature";
          const corpsEmail = `Bonjour ${candidat.prenom} ${candidat.nom},<br>
Nous avons le plaisir de vous informer que vous avez été retenu(e) pour faire partie de l'Orchestre Symphonique de Carthage. Félicitations pour cette réussite, et nous sommes impatients de vous accueillir au sein de notre talentueuse équipe.<br>
Vous trouverez ci-joint la Charte de l'Orchestre Symphonique de Carthage pour la signer.<br>
Pour confirmer votre participation, veuillez cliquer sur ce lien : <a href="${lienConfirm}">Confirmer</a><br>
Cordialement`;
          
          // Attachement de la charte
          const attachments = [{
            filename: "charte.pdf",
            content: charteBuffer,
          }];

          // Envoyer l'email avec le contenu et les pièces jointes
          await sendEmail(candidat.email, sujetEmail, corpsEmail, attachments);
        }
      }
    }

    // Répondre avec un message de succès
    return res.status(200).json({
      message: "Emails d'acceptation envoyés avec succès à tous les candidats retenus de toutes les auditions",
    });
  } catch (error) {
    // En cas d'erreur, renvoyer un statut 500 avec un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  accepterCandidatParAudition,
};

function paginatedResults(model, page, limit) {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  let paginatedResults = {};

  if (endIndex < model.length) {
    paginatedResults.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    paginatedResults.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  paginatedResults.results = model.slice(startIndex, endIndex);
  return paginatedResults;
}

const fetshCandidats = async (req, res) => {
  try {
    let candidates = await Candidats.find();
    let filteredCandidates = [...candidates];
    const { page, limit, ...filters } = req.query;
    if (Object.keys(filters).length > 0) {
      filteredCandidates = filteredCandidates.filter((candidate) => {
        return Object.entries(filters).every(([key, value]) => {
          return (
            candidate[key].toString().toLowerCase() ===
            value.toString().toLowerCase()
          );
        });
      });
    }
    if (req.query.page && req.query.limit) {
      res
        .status(200)
        .json(
          paginatedResults(filteredCandidates, parseInt(page), parseInt(limit))
        );
    } else res.status(200).json(filteredCandidates);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const addEmailCandidat = async (req, res) => {
  try {
    let condidat = await CandidatsVerif.findOne({ email: req.body.email });
    if (condidat) {
      return res
        .status(409)
        .send({ message: "condidat with given email already exists!" });
    }

    condidat = await new CandidatsVerif({ ...req.body }).save();

    const token = jwt.sign(
      { condidatId: condidat._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const url = `${process.env.BASE_URL}/api/candidats/${condidat.id}/verify/${token}`;
    await sendEmail(condidat.email, "Verify Email", url);

    res
      .status(201)
      .send({ message: "An Email sent to your account, please verify" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const getToken = async (req, res) => {
  try {
    const { id, token } = req.params;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const condidat = await CandidatsVerif.findOne({ _id: id });
    if (!condidat) {
      console.log("condidat not found");
      return res.status(400).send({ message: "Invalid link" });
    }

    await CandidatsVerif.updateOne(
      { _id: condidat._id },
      { $set: { verified: true } }
    );

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(400).send({ message: "Token has expired" });
    } else {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
};

const dateFormRange = async (req, res, next) => {
  try {
    const newDateRange = new DateRange({
      dateDebut: new Date(req.body.dateDebut),
      dateFin: new Date(req.body.dateFin),
    });

    const existingDateRange = await DateRange.findOne();

    if (existingDateRange) {
      return res
        .status(400)
        .json({ error: "Date range already exists in the database" });
    }

    const resDateRange = await newDateRange.save();
    res.status(201).json(resDateRange);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateDateRange = async (req, res) => {
  try {
    const updatedDateRange = {
      dateDebut: new Date(req.body.dateDebut),
      dateFin: new Date(req.body.dateFin),
    };

    const existingDateRange = await DateRange.findOne();

    if (!existingDateRange) {
      return res
        .status(404)
        .json({ error: "Date range not found in the database" });
    }

    existingDateRange.dateDebut = updatedDateRange.dateDebut;
    existingDateRange.dateFin = updatedDateRange.dateFin;

    const savedDateRange = await existingDateRange.save();

    res.status(200).json(savedDateRange);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

const rempForm = async (req, res) => {
  try {
    const { id } = req.params;

    const condidat = await CandidatsVerif.findOne({ _id: id });

    if (!condidat) {
      return res.status(400).send({ message: "Candidate not found" });
    }

    if (!condidat.verified) {
      return res.status(401).send({ message: "Email not verified yet" });
    }

    const {
      nom,
      prenom,
      sexe,
      CIN,
      taille,
      telephone,
      nationalite,
      dateNaissance,
      activite,
      connaisanceMusical,
      situationPerso,
      
    } = req.body;
    const newCondidat = await new Candidats({
      nom,
      prenom,
      email: condidat.email,
      sexe,
      CIN,
      taille,
      telephone,
      nationalite,
      dateNaissance,
      activite,
      connaisanceMusical,
      situationPerso,
    }).save();
    res.status(201).send({
      message: "le candidat a été créé avec sucéé",
      data: newCondidat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};
// const accepterCandidatParAudition=async(req,res)=>{
//   const pdfFile=req.file
//   try{
//     const auditions=await Audition.find({"candidatsInfo": { $not: { $size: 0 } }}).populate('candidats')
//     for(const audition of auditions ){
//       for(let i=0;i<audition.candidats.length;i++){
//         const candidat=audition.candidats[i]
//         const candidatInfo=audition.candidatsInfo[i]
//         if(candidatInfo.decision==='Retenu'){
//           const lienConfirm=`http://localhost:8000/api/candidats/confirm/${candidat._id}`
//           const sujetEmail="Acceptation de votre candidature"
//           const corpsEmail = `Bonjour ${candidat.prenom} ${candidat.nom},<br>
// Nous avons le plaisir de vous informer que vous avez été retenu(e) pour faire partie de l'Orchestre Symphonique de Carthage. Félicitations pour cette réussite, et nous sommes impatients de vous accueillir au sein de notre talentueuse équipe.<br>
// Vous trouverez ci-joint la Charte de l'Orchestre Symphonique de Carthage pour la signer.<br>
// Pour confirmer votre participation,veuillez cliquer sur ce lien:<a href="${lienConfirm}">Confirmer</a><br>
// Cordialement `
//           const namePDF="charte.pdf"
//           const attachments=[
//             {
//               filename: namePDF,
//               content: pdfFile.buffer,
//             },
//           ];
//           await sendEmail(candidat.email, sujetEmail, corpsEmail, attachments);
//         }
//       }
//     }
//     return res
//       .status(200)
//       .json({
//         message:
//           "Emails d'acceptation envoyés avec succés à tous les candidats retenus de toutes les auditions",
//       });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };
const candidatsParTessiture = async (req, res) => {
  try {
    const tessitureParam = req.params.tessiture;
    const tessiture = tessitureParam.toLowerCase();
    const auditions = await Audition.find({
      "candidatsInfo": { $not: { $size: 0 } },"candidatsInfo.tessiture": tessiture,
    }).populate("candidats");
    const candidatsParTessiture = [];
    for (const audition of auditions) {
      for (let i = 0; i < audition.candidatsInfo.length; i++) {
        const candidat=audition.candidats[i]
        const candidatInfo=audition.candidatsInfo[i]
        if(candidat && candidatInfo){
        const {
          _id,
          nom,
          prenom,
          email,
          sexe,
          CIN,
          taille,
          telephone,
          nationalite,
          dateNaissance,
          activite,
          connaissanceMusical,
          situationPerso,
        } = candidat;
        const decision = audition.candidatsInfo[i].decision;
        if (audition.candidatsInfo[i].tessiture.toLowerCase() === tessiture) {
          candidatsParTessiture.push({
            _id,
            nom,
            prenom,
            email,
            sexe,
            CIN,
            taille,
            telephone,
            nationalite,
            dateNaissance,
            activite,
            connaissanceMusical,
            situationPerso,
            decision,
          });
        }
      }
    }
    }
    const sortedCandidats = candidatsParTessiture.sort((a, b) => {
      const decisionsOrder = { Retenu: 1, Refusé: 2 };
      return decisionsOrder[a.decision] - decisionsOrder[b.decision];
    });
    return res.status(200).json(sortedCandidats);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// const confirmParticipationEtDevenirChoriste=async(req,res)=>{
//   const candidatId = req.params.id;
//   try {
//     const candidat = await Candidats.findOne({"_id":candidatId});
//     if (!candidat) {
//       return res.status(404).json({ message: 'Candidat non trouvé' });
//     }
//     if(candidat.confirm){
//       return res.status(404).json({ message: 'Vous avez déjà confirmer votre participation' });
//     }
    
//     const passAleatoire=generatePassword.generate({
//       length:12,
//       numbers:true,
//       uppercase:true,
//       lowercase:true,
//       symbols:true
//     })
//     const hashedPassword=await bcrypt.hash(passAleatoire,10)
//     const nouveauMembre=new Membre({
//       nom:candidat.nom,
//       prenom:candidat.prenom,
//       email:candidat.email,
//       password:hashedPassword,
//       sexe:candidat.sexe,
//       dateNaissance:candidat.dateNaissance,
//       nationalite:candidat.nationalite,
//       CIN:candidat.CIN,
//       taille:candidat.taille,
//       situationPerso:candidat.situationPerso,
//       connaissanceMusic:candidat.connaisanceMusical,
//       activite:candidat.activite,
//       telephone:candidat.telephone,
//       role:'choriste',
//       statut:'Inactif',

//     })
//     const auditions=await Audition.find({"candidatsInfo": { $not: { $size: 0 } }})
//     for(const audition of auditions){
//       for(let i=0;i<audition.candidats.length;i++){
//         const currentCandidat=audition.candidats[i]
//         const currentCandidatID=currentCandidat.toString()
//         const infoCandidat=audition.candidatsInfo[i]
//         if(currentCandidatID===candidatId){
//           const tessiture=infoCandidat.tessiture
//           nouveauMembre.pupitre=tessiture
//           break
//           }
          
//         }
//       }
//     candidat.confirm = true;
//     await candidat.save();
//     const currentSaison = await Saison.findOne({ saisonCourante: true });
//     if (currentSaison) {
//       currentSaison.membres.push(nouveauMembre._id);
//       await currentSaison.save();
//     }
//     await nouveauMembre.save()

   
//     const corpsEmail=`Bonjour ${candidat.prenom} ${candidat.nom},<br>
//     Votre participation a été confirmée.<br>
//     Pour accéder à votre compte,voici vos coordonnées.<br>
//     Email: ${candidat.email} <br>
//     Mot de passe: ${passAleatoire} <br> 
//     Cordialement`
//     await sendEmail(candidat.email,"Informations d'inscriptions",corpsEmail)
//     return res.status(200).json({ message: 'Confirmation et inscription en tant que membre effectuées avec succés' });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// }
const confirmParticipationEtDevenirChoriste=async(req,res)=>{
  const candidatId = req.params.id;
  try {
    const candidat = await Candidats.findOne({"_id":candidatId});
    if (!candidat) {
      return res.status(404).json({ message: 'Candidat non trouvé' });
    }
    if(candidat.confirm){
      return res.redirect('http://localhost:3000/');

    }
    
    const passAleatoire=generatePassword.generate({
      length:12,
      numbers:true,
      uppercase:true,
      lowercase:true,
      symbols:true
    })
    const hashedPassword=await bcrypt.hash(passAleatoire,10)
    const nouveauMembre=new Membre({
      nom:candidat.nom,
      prenom:candidat.prenom,
      email:candidat.email,
      password:hashedPassword,
      sexe:candidat.sexe,
      dateNaissance:candidat.dateNaissance,
      nationalite:candidat.nationalite,
      CIN:candidat.CIN,
      taille:candidat.taille,
      situationPerso:candidat.situationPerso,
      connaissanceMusic:candidat.connaisanceMusical,
      activite:candidat.activite,
      telephone:candidat.telephone,
      role:'choriste',
      statut:'Inactif',

    })
    const auditions=await Audition.find({"candidatsInfo": { $not: { $size: 0 } }})
    for(const audition of auditions){
      for(let i=0;i<audition.candidats.length;i++){
        const currentCandidat=audition.candidats[i]
        const currentCandidatID=currentCandidat.toString()
        const infoCandidat=audition.candidatsInfo[i]
        if(currentCandidatID===candidatId){
          const tessiture=infoCandidat.tessiture
          nouveauMembre.pupitre=tessiture
          break
          }
          
        }
      }
    candidat.confirm = true;
    await candidat.save();
    const currentSaison = await Saison.findOne({ saisonCourante: true });
    if (currentSaison) {
      currentSaison.membres.push(nouveauMembre._id);
      await currentSaison.save();
    }
    await nouveauMembre.save()

   
    const corpsEmail=`Bonjour ${candidat.prenom} ${candidat.nom},<br>
    Votre participation a été confirmée.<br>
    Pour accéder à votre compte,voici vos coordonnées.<br>
    Email: ${candidat.email} <br>
    Mot de passe: ${passAleatoire} <br> 
    Cordialement`
    await sendEmail(candidat.email,"Informations d'inscriptions",corpsEmail)
    return res.redirect('http://localhost:3000/');
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
module.exports = {
  fetshCandidats,
  addEmailCandidat,
  getToken,
  dateFormRange,
  updateDateRange,
  rempForm,
  accepterCandidatParAudition,
  candidatsParTessiture,
  confirmParticipationEtDevenirChoriste
};
