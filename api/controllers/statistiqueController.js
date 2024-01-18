const Membre = require("../models/membreModel");
const Repetition = require("../models/repetitionModel");
const Concert = require("../models/concertModel");
const Oeuvre = require("../models/oeuvreModel");

const fetchStatisticsByConcert = async (req, res) => {
  try {
    const concerts = await Concert.find();
    const concertStatistics = [];

    for (const concert of concerts) {
      const concertStats = {
        titre: concert.titre,
        presenceInConcert: 0,
        absenceInConcert: 0,
        presencePercentageInConcert: 0,
        absencePercentageInConcert: 0,
        masteringOeuvreCount: {},
        presenceInRepetitionOfConcert: 0,
        absenceInRepetitionOfConcert: 0,
        presencePercentageInRepetitionOfConcert: 0,
        absencePercentageInRepetitionOfConcert: 0,
      };

      concert.listeMembres.forEach((memberInfo) => {
        memberInfo.presence
          ? concertStats.presenceInConcert++
          : concertStats.absenceInConcert++;
      });

      const totalMembersInConcert = concert.listeMembres.length;
      concertStats.presencePercentageInConcert =
        totalMembersInConcert > 0
          ? (concertStats.presenceInConcert / totalMembersInConcert) * 100
          : 0;
      concertStats.absencePercentageInConcert =
        totalMembersInConcert > 0
          ? (concertStats.absenceInConcert / totalMembersInConcert) * 100
          : 0;

      const repetitions = await Repetition.find({ concert: concert._id });

      for (const programInfo of concert.programme) {
        const oeuvre = await Oeuvre.findById(programInfo.oeuvre);

        if (oeuvre) {
          // Multiply the count with the number of repetitions
          concertStats.masteringOeuvreCount[oeuvre.titre] =
            (concertStats.masteringOeuvreCount[oeuvre.titre] || 0) + 1 * repetitions.length;
        }
      }

      repetitions.forEach((repetition) => {
        repetition.membres.forEach((memberInfo) => {
          {
            memberInfo.presence == true
              ? concertStats.presenceInRepetitionOfConcert++
              : concertStats.absenceInRepetitionOfConcert++;
          }
        });
      });

      const totalMembersInRepetitionOfConcert =
        concertStats.presenceInRepetitionOfConcert +
        concertStats.absenceInRepetitionOfConcert;

      concertStats.presencePercentageInRepetitionOfConcert =
        totalMembersInRepetitionOfConcert > 0
          ? (concertStats.presenceInRepetitionOfConcert /
              totalMembersInRepetitionOfConcert) *
            100
          : 0;

      concertStats.absencePercentageInRepetitionOfConcert =
        totalMembersInRepetitionOfConcert > 0
          ? (concertStats.absenceInRepetitionOfConcert /
              totalMembersInRepetitionOfConcert) *
            100
          : 0;

      concertStats.presencePercentageInRepetitionOfConcert = parseFloat(
        concertStats.presencePercentageInRepetitionOfConcert.toFixed(2)
      );
      concertStats.absencePercentageInRepetitionOfConcert = parseFloat(
        concertStats.absencePercentageInRepetitionOfConcert.toFixed(2)
      );

      concertStatistics.push(concertStats);
    }

    res.json(concertStatistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchStatisticsByOeuvre = async (req, res) => {
  try {
    const oeuvres = await Oeuvre.find();
    const oeuvreStatistics = [];

    for (const oeuvre of oeuvres) {
      const oeuvreStats = {
        titre: oeuvre.titre,
        presenceInConcert: 0,
        absenceInConcert: 0,
        presencePercentageInConcert: 0,
        absencePercentageInConcert: 0,
        masteringCount: 0,
        presenceInRepetitionOfConcert: 0,
        absenceInRepetitionOfConcert: 0,
        presencePercentageInRepetitionOfConcert: 0,
        absencePercentageInRepetitionOfConcert: 0,
      };

      const concertsWithOeuvre = await Concert.find({
        "programme.oeuvre": oeuvre._id,
      });

      for (const concert of concertsWithOeuvre) {
        for (const memberInfo of concert.listeMembres) {
          if (memberInfo.presence) {
            oeuvreStats.presenceInConcert++;
          } else {
            oeuvreStats.absenceInConcert++;
          }
        }

        const repetitions = await Repetition.find({
          concert: concert._id,
        });

        for (const repetition of repetitions) {
          repetition.membres.forEach((memberInfo) => {
            const isPresent = memberInfo.presence;

            const oeuvreIds = repetition.membres
              .filter(
                (repMember) =>
                  repMember.oeuvre &&
                  repMember.oeuvre.toString() === oeuvre._id.toString()
              )
              .map((repMember) =>
                repMember.member ? repMember.member.toString() : ""
              );

            if (isPresent) {
              oeuvreStats.presenceInRepetitionOfConcert++;
            } else {
              oeuvreStats.absenceInRepetitionOfConcert++;
            }
          });
        }
      }

      const totalMembersInOeuvreConcert =
        oeuvreStats.presenceInConcert + oeuvreStats.absenceInConcert;

      oeuvreStats.presencePercentageInConcert =
        totalMembersInOeuvreConcert > 0
          ? (oeuvreStats.presenceInConcert / totalMembersInOeuvreConcert) * 100
          : 0;

      oeuvreStats.absencePercentageInConcert =
        totalMembersInOeuvreConcert > 0
          ? (oeuvreStats.absenceInConcert / totalMembersInOeuvreConcert) * 100
          : 0;

      const totalMembersInRepetitionOfConcert =
        oeuvreStats.presenceInRepetitionOfConcert +
        oeuvreStats.absenceInRepetitionOfConcert;

      oeuvreStats.presencePercentageInRepetitionOfConcert =
        totalMembersInRepetitionOfConcert > 0
          ? (oeuvreStats.presenceInRepetitionOfConcert /
              totalMembersInRepetitionOfConcert) *
            100
          : 0;

      oeuvreStats.absencePercentageInRepetitionOfConcert =
        totalMembersInRepetitionOfConcert > 0
          ? (oeuvreStats.absenceInRepetitionOfConcert /
              totalMembersInRepetitionOfConcert) *
            100
          : 0;

      oeuvreStats.masteringCount = oeuvreStats.presenceInRepetitionOfConcert;

      oeuvreStats.presencePercentageInRepetitionOfConcert = parseFloat(
        oeuvreStats.presencePercentageInRepetitionOfConcert.toFixed(2)
      );
      oeuvreStats.absencePercentageInRepetitionOfConcert = parseFloat(
        oeuvreStats.absencePercentageInRepetitionOfConcert.toFixed(2)
      );

      oeuvreStatistics.push(oeuvreStats);
    }

    res.json(oeuvreStatistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchStatisticsByChoriste = async (req, res) => {
  try {
    const members = await Membre.find();
    const choristeStatistics = [];

    for (const member of members) {
      const choristeStats = {
        member_id: member._id,
        presenceInConcert: 0,
        absenceInConcert: 0,
        presencePercentageInConcert: 0,
        absencePercentageInConcert: 0,
        masteringOeuvreCount: {},
        presenceInRepetitionOfConcert: 0,
        absenceInRepetitionOfConcert: 0,
        presencePercentageInRepetitionOfConcert: 0,
        absencePercentageInRepetitionOfConcert: 0,
      };

      const concertsForMember = await Concert.find({
        "listeMembres.membre": member._id,
      });

      for (const concert of concertsForMember) {
        const concertMemberInfo = concert.listeMembres.find(
          (memberInfo) => memberInfo.membre.toString() === member._id.toString()
        );

        if (concertMemberInfo) {
          concertMemberInfo.presence
            ? choristeStats.presenceInConcert++
            : choristeStats.absenceInConcert++;
        }
      }

      const totalConcertsForMember =
        choristeStats.presenceInConcert + choristeStats.absenceInConcert;

      choristeStats.presencePercentageInConcert =
        totalConcertsForMember > 0
          ? (choristeStats.presenceInConcert / totalConcertsForMember) * 100
          : 0;

      choristeStats.absencePercentageInConcert =
        totalConcertsForMember > 0
          ? (choristeStats.absenceInConcert / totalConcertsForMember) * 100
          : 0;

      const repetitionsForMember = await Repetition.find({
        "membres.member": member._id,
        "membres.presence": true,
      }).populate({
        path: "concert",
        model: "Concert",
      });

      const repetitionsForMemberAbsent = await Repetition.find({
        "membres.member": member._id,
        "membres.presence": false,
      }).populate({
        path: "concert",
        model: "Concert",
      });

      for (const repetitionForMember of repetitionsForMember) {
        choristeStats.presenceInRepetitionOfConcert =
          choristeStats.presenceInRepetitionOfConcert + 1 || 0;
        for (const programInfo of repetitionForMember.concert.programme) {
          const oeuvre = await Oeuvre.findById(programInfo.oeuvre);

          if (oeuvre) {
            // Increment the count
            choristeStats.masteringOeuvreCount[oeuvre.titre] =
              (choristeStats.masteringOeuvreCount[oeuvre.titre] || 0) + 1;
          }
        }
      }

      for (const repetitionForMemberAbsent of repetitionsForMemberAbsent) {
        choristeStats.absenceInRepetitionOfConcert =
          choristeStats.absenceInRepetitionOfConcert + 1 || 0;
      }

      const totalRepetitionsForMember =
        choristeStats.presenceInRepetitionOfConcert +
        choristeStats.absenceInRepetitionOfConcert;

      choristeStats.presencePercentageInRepetitionOfConcert =
        totalRepetitionsForMember > 0
          ? (choristeStats.presenceInRepetitionOfConcert /
              totalRepetitionsForMember) *
            100
          : 0;

      choristeStats.absencePercentageInRepetitionOfConcert =
        totalRepetitionsForMember > 0
          ? (choristeStats.absenceInRepetitionOfConcert /
              totalRepetitionsForMember) *
            100
          : 0;

      choristeStats.presencePercentageInConcert = parseFloat(
        choristeStats.presencePercentageInConcert.toFixed(2)
      );
      choristeStats.absencePercentageInConcert = parseFloat(
        choristeStats.absencePercentageInConcert.toFixed(2)
      );

      choristeStats.presencePercentageInRepetitionOfConcert = parseFloat(
        choristeStats.presencePercentageInRepetitionOfConcert.toFixed(2)
      );
      choristeStats.absencePercentageInRepetitionOfConcert = parseFloat(
        choristeStats.absencePercentageInRepetitionOfConcert.toFixed(2)
      );

      choristeStatistics.push(choristeStats);
    }

    res.json(choristeStatistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  fetchStatisticsByConcert,
  fetchStatisticsByOeuvre,
  fetchStatisticsByChoriste,
};
