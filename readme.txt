// models are 

Users

FarmerProfile

TransporterProfile

RetailerProfile

MiddlemanProfile

CropRegistry

TransactionLog

PaymentEscrow



// routes 

🌾 Farmer & Crop Registration

API	Purpose	
POST /registerFarmer	Register farmer profile (name, phone, location)	
POST /registerCrop	Upload crop image + metadata	
POST /analyzeCropImage	Send image to AI model → get variety, quality, shelf life	
POST /generateQRCode	Generate QR with crop ID, CID, expiry	
POST /storeToIPFS	Upload image + metadata to IPFS	
POST /storeToBlockchain	Store CID + metadata hash on-chain	
GET /getCropDetails/:qrId	Fetch crop info by QR ID	


---

🧑‍💼 Middle Man Verification

API	Purpose	
POST /scanQRCode	Scan QR from app	
POST /uploadMiddlemanImage	Upload crop image for verification	
POST /verifyCropMatch	AI match farmer vs middleman image	
POST /executeContract	Trigger smart contract if match is true	
POST /registerDriver	Generate driver ID and assign to batch	
POST /updateBatchStatus	Mark batch as packed or ready for transport	


---

🚚 Transport & Delivery

API	Purpose	
POST /startDelivery	Driver scans QR, enters quantity, starts delivery	
POST /logGPSRoute	Upload GPS + timestamp data	
POST /storeRouteToIPFS	Save route to IPFS	
POST /storeRouteHashToBlockchain	Log route hash on-chain	
POST /verifyDelivery	Middleman scans at destination, verifies quantity	
POST /confirmDelivery	AI match expected vs delivered → approve delivery	
POST /updateDeliveryStatus	MongoDB update for delivery verification	


---

🏪 Seller & Retail

API	Purpose	
POST /sellerScanQRCode	Seller scans QR	
POST /uploadSellerImage	Upload image for verification	
POST /verifySellerMatch	AI match middleman vs seller image	
POST /approveSale	Execute contract if match is true	
POST /updateSaleStatus	MongoDB update for sale approval	


---

👨‍👩‍👧‍👦 Consumer Access

API	Purpose	
GET /scanQRCode	Consumer scans QR	
GET /getFullTrace/:qrId	Fetch full trace: farmer → middleman → seller	
GET /getExpiryStatus/:qrId	Check shelf life and expiry	


---

🔐 Admin & Analytics

API	Purpose	
GET /getFraudAlerts	Flag mismatches or failed verifications	
GET /getDashboardStats	View batch status, delivery logs, contract execution	
GET /getAuditTrail/:qrId	Full traceability log for any crop	


---

{
    "name":"robin",
    "password":"random",
    "contact":"8470808956",
    "location":"japan",
    "landSize":85.0,
    "farming_exp":8,
    "prefered_crop_type":"orange",
    "certifications":"none",
    "aadhar_number":"485217956325"
}
{
  "name":"transporte1",
    "contact":"4879563256",
    "location":"USA",
    "password":"kjdhsvfikjsbdfv",
    "vehicle_number":"sodfijhsohdfn",
    "license_number":"ikjhdsifcjbsdbfc",
    "vehicle_type":"tuk-tuk",
    "capacity_tons":30,
    "available":true
}