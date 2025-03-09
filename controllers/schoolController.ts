import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define request body interface
interface SchoolRequestBody {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

// Add School API Controller
export const addSchool = async (req: Request<{}, {}, SchoolRequestBody>, res: Response) => {
  console.log("Received request body:", req.body); // Debugging log

  const { name, address, latitude, longitude } = req.body as SchoolRequestBody;

  if (!name || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return res.status(400).json({ error: "Latitude and longitude must be numbers" });
  }

  try {
    const newSchool = await prisma.school.create({
      data: { name, address, latitude, longitude },
    });
    res.status(201).json({ message: "School added successfully", school: newSchool });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const toRadians = (degree: number) => (degree * Math.PI) / 180;
    const R = 6371; 
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  };
  
 
  export const listSchools = async (req: Request, res: Response) => {
    const { latitude, longitude } = req.query;
  
   
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }
  
    const userLat = parseFloat(latitude as string);
    const userLon = parseFloat(longitude as string);
  
    if (isNaN(userLat) || isNaN(userLon)) {
      return res.status(400).json({ error: "Invalid latitude or longitude" });
    }
  
    try {
      const schools = await prisma.school.findMany();
  
   
      const sortedSchools = schools
        .map((school) => ({
          ...school,
          distance: calculateDistance(userLat, userLon, school.latitude, school.longitude),
        }))
        .sort((a, b) => a.distance - b.distance);
  
      return res.status(200).json(sortedSchools);
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };