import React from "react";
import { useState } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";
import { BsQrCodeScan } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";

const App = () => {
	const [data, setData] = useState("");
	const [error, setError] = useState("");
	const [showScanner, setShowScanner] = useState(false);

	const isUPIString = (str) => {
		// UPI ID format validation
		const upiRegex = /^[\w\.\-_]{3,}@[a-zA-Z]{3,}$/;
		return upiRegex.test(str);
	};

	const handleScan = (err, result) => {
		if (result) {
			const scannedText = result.text;

			// Check if the scanned text contains UPI ID
			if (scannedText.includes("upi://pay?pa=")) {
				// Extract UPI ID from the string
				const upiMatch = scannedText.match(/pa=([^&]+)/);
				if (upiMatch && isUPIString(upiMatch[1])) {
					setData(upiMatch[1]);
					setError("");
				} else {
					setData("");
					setError("Invalid UPI QR Code");
				}
			} else {
				setData("");
				setError("This is not a UPI QR Code");
			}
		} else {
			setData("");
			setError("");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
			<IoMdArrowRoundBack
				onClick={() => setShowScanner(false)}
				className="absolute top-4 left-4 text-white cursor-pointer hover:scale-110 transition-transform duration-300 text-3xl"
			/>
			{!showScanner ? (
				<div
					className="cursor-pointer hover:scale-110 transition-transform duration-300"
					onClick={() => setShowScanner(true)}
				>
					<div className="bg-white p-8 rounded-full shadow-2xl">
						<BsQrCodeScan
							style={{
								marginLeft: "23px",
								fontSize: "64px",
								color: "#1a1a1a",
							}}
						/>
					</div>
					<p className="text-white text-center mt-4 text-lg font-semibold">
						Click to Open Scanner
					</p>
				</div>
			) : (
			<div className="h-100vh bg-gray-900 items-center justify-center p-4">
      {/* Main Scanner Card */}
        <h1 className="text-2xl text-center text-white mb-4 md:text:3xl">Scan your QR here</h1>
      <div className="relative h-[450px] w-[600px] aspect-square rounded-xl border-4 border-gray-200 overflow-hidden shadow-2xl">
        {/* QR Scanner */}
        <BarcodeScanner
          onUpdate={handleScan}
          className="w-full h-full object-cover"
          facingMode="environment"
        />

        {/* Purple corners overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-12 left-28 w-12 h-12 border-t-4 border-l-4 border-purple-500 rounded-tl-lg"></div>
          <div className="absolute top-12 right-28 w-12 h-12 border-t-4 border-r-4 border-purple-500 rounded-tr-lg"></div>
          <div className="absolute bottom-12 left-28 w-12 h-12 border-b-4 border-l-4 border-purple-500 rounded-bl-lg"></div>
          <div className="absolute bottom-12 right-28 w-12 h-12 border-b-4 border-r-4 border-purple-500 rounded-br-lg"></div>
        </div>

        {/* Scanned Data / Error */}
        {error ? (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 rounded-lg p-4 w-[90%] text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        ) : (
          data && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-green-100 border border-green-400 rounded-lg p-4 w-[90%] text-center">
              <p className="text-lg font-medium text-gray-700">UPI ID Found:</p>
              <p className="text-xl text-green-600 font-semibold break-all">{data}</p>
            </div>
          )
        )}
      </div>
    </div>
			)}
		</div>
	);
};

export default App;
