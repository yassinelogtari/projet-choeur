const Membre = require("../models/membreModel");
const Concert = require("../models/concertModel");
const Placement = require("../models/placementModel");
const addPlacement = async (req, res) => {
  try {
    const concertId = req.body.concert_id;
    const concert = await Concert.findById(concertId).populate({
      path: "listeMembres.membre", // Adjust the path to include the members
      model: "Membre", // Specify the model for the population
    });
    const placesParRangee = req.body.nombreDePlacesParRangée;
    const nombreRangees = req.body.nombreDeRangées;
    const membresDisponibles = concert.listeMembres.filter(
      (membre) => membre.disponibility.isAvailable
    );
    const sortedMembers = membresDisponibles.sort(
      (a, b) => a.membre.taille - b.membre.taille
    );
    const altos = sortedMembers.filter(
      (membre) => membre.membre.pupitre === "alto"
    );
    const sopranos = sortedMembers.filter(
      (membre) => membre.membre.pupitre === "soprano"
    );
    const tenors = sortedMembers.filter(
      (membre) => membre.membre.pupitre === "ténor"
    );
    const basses = sortedMembers.filter(
      (membre) => membre.membre.pupitre === "basse"
    );
    const nombreRangeesAltosSopranos = Math.ceil(
      Math.max(altos.length, sopranos.length) / (placesParRangee / 2)
    );
    const placement = {
      concert: concertId,
      place: [],
    };
    let altoIndex = 0;
    let sopranoIndex = 0;
    let tenorIndex = 0;
    let basseIndex = 0;

    if (membresDisponibles.length === 0) {
      return res
        .status(404)
        .json({ message: "Il y'a pas des membres à placer" });
    } else if (membresDisponibles.length > nombreRangees * placesParRangee) {
      return res
        .status(404)
        .json({ message: "Il y'a pas suffisament de places" });
    } else {
      for (let i = 0; i < nombreRangees; i++) {
        for (let j = 0; j < placesParRangee; j++) {
          let currentMember;
          if (
            j < placesParRangee / 2 &&
            i < nombreRangeesAltosSopranos &&
            altoIndex < altos.length
          ) {
            currentMember = altos[altoIndex].membre;
            altoIndex++;
          } else if (
            j >= placesParRangee / 2 &&
            i < nombreRangeesAltosSopranos &&
            sopranoIndex < sopranos.length
          ) {
            currentMember = sopranos[sopranoIndex].membre;
            sopranoIndex++;
          } else if (
            j < placesParRangee / 2 &&
            i >= nombreRangeesAltosSopranos &&
            basseIndex < basses.length
          ) {
            currentMember = basses[basseIndex].membre;
            basseIndex++;
          } else if (
            j >= placesParRangee / 2 &&
            i >= nombreRangeesAltosSopranos &&
            tenorIndex < tenors.length
          ) {
            currentMember = tenors[tenorIndex].membre;
            tenorIndex++;
          }
          if (currentMember && currentMember._id) {
            placement.place.push({
              row: i + 1,
              column: j + 1,
              membre: currentMember._id,
            });
          } else {
            placement.place.push({
              row: i + 1,
              column: j + 1,
              membre: null,
            });
          }
        }
      }
    }
    await Placement.create(placement);
    return res.status(200).json({
      message: "placement sauvegardé avec succés",
      model: placement,
    });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
// const getPlacementById = async (req, res) => {
//   try {
//     const placement = await Placement.findOne({ _id: req.params.id })
//       .populate({ path: "place.membre", select: "nom prenom pupitre " })
//       .exec();
//     if (placement) {
//       res.status(200).json({
//         message: "Placement trouvé",
//         model: placement,
//       });
//     } else {
//       res.status(404).json({ message: "Placement non trouvé" });
//     }
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
const updatePlacement = async (req, res) => {
  try {
    const placementId = req.params.id;
    const row = req.body.row;
    const column = req.body.column;
    const memberId = req.body.membre;

    const placement = await Placement.findById(placementId);
    if (!placement) {
      return res.status(404).json({ message: "Placement non trouvé" });
    } else {
      const currentPlace = placement.place.find(
        (p) => p.membre && p.membre.toString() === memberId.toString()
      );
      if (!currentPlace) {
        return res
          .status(404)
          .json({ message: "Membre non trouvé dans le placement actuel" });
      }
      const newPlace = placement.place.find(
        (p) => p.row === row && p.column === column
      );
      if (!newPlace) {
        return res.status(404).json({ message: "Nouvelle place non trouvée" });
      }
      if (newPlace.membre) {
        const tempMembre = newPlace.membre;
        newPlace.membre = currentPlace.membre;
        currentPlace.membre = tempMembre;
      } else {
        newPlace.membre = currentPlace.membre;
        currentPlace.membre = null;
      }
      await placement.save();
      return res.status(200).json({
        message: "Placement mis à jour avec succés",
        model: placement,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllPlacements = async (req, res) => {
  try {
    const placements = await Placement.find().populate({
      path: "concert",
      populate: { path: "listeMembres.membre" },
    });

    console.log("Populated Placements:", placements);

    // Send the response with the populated placements
    res.status(200).json({
      message: "All placements fetched successfully",
      placements: placements,
    });
  } catch (error) {
    // If an error occurs, log it and send an error response
    console.error("Error fetching placements:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addPlacement,
  //getPlacementById,
  updatePlacement,
  getAllPlacements,
};
