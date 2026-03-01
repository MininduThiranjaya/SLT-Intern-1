const express = require("express");
const cron = require("node-cron");
const { Op } = require("sequelize");
const { Booking } = require("../models/index");

const startAutoCancelJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const oneHour = new Date(Date.now() - 60 * 60 * 1000);
      await Booking.update(
        { status: "CANCELLED" },
        {
          where: {
            status: "PENDING",
            createdAt: {
              [Op.lt]: oneHour,
            },
          },
        },
      );
    } catch (e) {
      console.log(e);
    }
  });
  console.log("Automation started via corn job");
};

module.exports = {startAutoCancelJob}
