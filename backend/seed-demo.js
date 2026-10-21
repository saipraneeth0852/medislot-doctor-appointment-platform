// Seeds a few clearly-labelled SYNTHETIC demo doctors (no real people, contacts or photos).
// Usage: MONGODB_URI=... DEMO_DOCTOR_PASSWORD=... node seed-demo.js
import 'dotenv/config'
import bcrypt from 'bcrypt'
import connectDB from './config/mongodb.js'
import doctorModel from './models/doctorModel.js'
import mongoose from 'mongoose'

const avatar = (initials, color) =>
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="${color}"/><text x="150" y="175" font-size="100" text-anchor="middle" fill="white" font-family="Arial">${initials}</text></svg>`)

const demo = [
  ['Demo Doctor A', 'General physician', 'MBBS (demo)', '5 Years', 300, '#4f46e5', 'DA'],
  ['Demo Doctor B', 'Dermatologist', 'MD (demo)', '8 Years', 500, '#0d9488', 'DB'],
  ['Demo Doctor C', 'Pediatricians', 'MBBS, DCH (demo)', '6 Years', 400, '#be185d', 'DC'],
  ['Demo Doctor D', 'Neurologist', 'MD, DM (demo)', '10 Years', 700, '#b45309', 'DD'],
]

await connectDB()
const pw = process.env.DEMO_DOCTOR_PASSWORD
if (!pw || pw.length < 12) { console.error('Set DEMO_DOCTOR_PASSWORD (12+ chars)'); process.exit(1) }
const password = await bcrypt.hash(pw, 10)
for (const [name, speciality, degree, experience, fees, color, ini] of demo) {
  const email = `${name.toLowerCase().replace(/\s+/g, '.')}@demo.invalid`
  await doctorModel.updateOne({ email }, { $setOnInsert: {
    name, email, password, image: avatar(ini, color), speciality, degree, experience,
    about: 'Synthetic demo profile for a portfolio project. Not a real doctor. Bookings are not real and no payment is taken.',
    available: true, fees, address: { line1: 'Demo Clinic', line2: 'Sample City' }, date: Date.now(),
  } }, { upsert: true })
}
console.log('Seeded demo doctors:', await doctorModel.countDocuments())
await mongoose.disconnect()
