import express from "express";
import mongoose from "mongoose";
import Userlink from "../models/userlink.js";

const router = express.Router();

router.put('/update', async (req, res) => {
    const { sessionId, address } = req.body;
  
    if (!sessionId || !address) {
      return res.status(400).send({ error: 'Session ID and address are required' });
    }
  
    try {
      const updatedUserLink = await userlink.findOneAndUpdate(
        { autolink: sessionId },
        { address },
        { new: true } // Return the updated document
      );
  
      if (!updatedUserLink) {
        return res.status(404).send({ error: 'User link not found' });
      }
  
      res.send(updatedUserLink);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Failed to update user link' });
    }
  });

// GET all
router.get("/", async (req, res) => {
    try {
        const userlinks = await Userlink.find();
        res.json(userlinks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET one
router.get("/:id", getUserlink, (req, res) => {
    res.json(res.userlink);
});

// CREATE one
router.post("/", async (req, res) => {
    const userlink = new Userlink({
        user: req.body.user,
        autolink: req.body.autolink,
        address: req.body.address
    });
    try {
        const newUserlink = await userlink.save();
        res.status(201).json(newUserlink);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE one
router.patch("/:id", getUserlink, async (req, res) => {
    if (req.body.user != null) {
        res.userlink.user = req.body.user;
    }
    if (req.body.autolink != null) {
        res.userlink.autolink = req.body.autolink;
    }
    try {
        const updatedUserlink = await res.userlink.save();
        res.json(updatedUserlink);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE one
router.delete("/:id", getUserlink, async (req, res) => {
    try {
        await res.userlink.remove();
        res.json({ message: "Deleted Userlink" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getUserlink(req, res, next) {
    let userlink;
    try {
        userlink = await Userlink.findById(req.params.id);
        if (userlink == null) {
            return res.status(404).json({ message: "Cannot find userlink" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.userlink = userlink;
    next();
}

export default router;