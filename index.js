const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());


// ========================================
// SUPABASE CONFIGURATION
// ========================================

const SUPABASE_URL = "https://gqiuqxhqhsgaouyuhjkw.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_2CkBl_P1fZLmNeIVMNAeag_1G8aaGYq";


// Create Supabase client
const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ========================================
// HOME ROUTE
// ========================================

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "User API is running"
    });

});


// ========================================
// GET USER BY ID
// ========================================

app.get("/users/:id", async (req, res) => {

    try {

        const id = req.params.id.trim();

        console.log("ID received:", id);


        // Get user from Supabase
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("ID", id)
            .maybeSingle();


        // Database error
        if (error) {

            console.error("Supabase Error:", error);

            return res.status(500).json({
                success: false,
                message: "Database error",
                error: error.message
            });

        }


        // User doesn't exist
        if (!data) {

            return res.status(404).json({
                success: false,
                message: "User not found",
                searchedID: id
            });

        }


        // User found
        return res.status(200).json({
            success: true,
            data: data
        });


    } catch (error) {

        console.error("Server Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

});


// ========================================
// EXPORT APP FOR VERCEL
// ========================================

module.exports = app;
