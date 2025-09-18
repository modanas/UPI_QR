import React, { useState } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";
import { BsQrCodeScan } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdFlashOn, MdFlashOff, MdUploadFile } from "react-icons/md";

const App = () => {
	const [data, setData] = useState("");
	const [error, setError] = useState("");
	const [showScanner, setShowScanner] = useState(false);
	const [torchOn, setTorchOn] = useState(false);

	const isUPIString = (str) => {
		const upiRegex = /^[\w.\-_]{3,}@[a-zA-Z]{3,}$/;
		return upiRegex.test(str);
	};

	const handleScan = (err, result) => {
		if (result) {
			const scannedText = result.text;

			if (scannedText.includes("upi://pay?pa=")) {
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
		}
	};

	// ✅ Upload QR from Gallery
	const handleFileUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const jsQR = (await import("jsqr")).default;

		const reader = new FileReader();
		reader.onload = (event) => {
			const img = new Image();
			img.src = event.target.result;
			img.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0, img.width, img.height);
				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
				const code = jsQR(imageData.data, canvas.width, canvas.height);

				if (code) {
					handleScan(null, { text: code.data });
				} else {
					setError("No QR Code found in image");
				}
			};
		};
		reader.readAsDataURL(file);
	};

	// ✅ Toggle Torch (mobile devices that support it)
	const toggleTorch = async () => {
		const videoElem = document.querySelector("video");
		if (videoElem && videoElem.srcObject) {
			const track = videoElem.srcObject.getVideoTracks()[0];
			const capabilities = track.getCapabilities();

			if (capabilities.torch) {
				track.applyConstraints({
					advanced: [{ torch: !torchOn }],
				});
				setTorchOn(!torchOn);
			} else {
				alert("Torch not supported on this device");
			}
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
			{!showScanner ? (
				<div
					className="cursor-pointer hover:scale-110 transition-transform duration-300"
					onClick={() => setShowScanner(true)}
				>
					<h1 className="mb-8 text-4xl text-white font-semibold text-center">
						SCANIFY
					</h1>
					<div className="bg-white p-8 rounded-full shadow-2xl">
						<BsQrCodeScan className="text-[68px] md:text-[64px] text-gray-900 lg:ml-[34px] ml-[35px] md:ml-7" />
					</div>
					<p className="text-white text-center mt-5 text-lg font-semibold">
						Click to Open Scanner👆🏻
					</p>
				</div>
			) : (
				<div className="fixed inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md z-50 p-4">
					{/* Back Button */}
					<IoMdArrowRoundBack
						onClick={() => setShowScanner(false)}
						className="absolute top-6 left-6 text-white cursor-pointer hover:scale-110 transition-transform duration-300 text-3xl"
					/>

					<h1 className="text-2xl md:text-3xl text-center text-white mb-4">
						Scan your QR here
					</h1>

					{/* Scanner Box */}
					<div className="relative w-[350px] md:w-[600px] max-w-full rounded-xl border-4 border-gray-200 overflow-hidden shadow-2xl bg-gray-900">
						<BarcodeScanner
							onUpdate={handleScan}
							className="w-full h-full object-cover"
							facingMode="environment"
						/>

						{/* Purple corners */}
						<div className="absolute inset-0 pointer-events-none">
							<div className="absolute top-22 left-16 w-12 h-12 border-t-4 border-l-4 border-purple-500 rounded-tl-lg"></div>
							<div className="absolute top-22 right-16 w-12 h-12 border-t-4 border-r-4 border-purple-500 rounded-tr-lg"></div>
							<div className="absolute bottom-22 left-16 w-12 h-12 border-b-4 border-l-4 border-purple-500 rounded-bl-lg"></div>
							<div className="absolute bottom-22 right-16 w-12 h-12 border-b-4 border-r-4 border-purple-500 rounded-br-lg"></div>
						</div>

						{/* Scanned Result */}
						{error ? (
							<div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-red-100/90 border border-red-400 rounded-lg p-4 w-[90%] text-center">
								<p className="text-red-700 font-medium">{error}</p>
							</div>
						) : (
							data && (
								<div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-green-100/90 border border-green-400 rounded-lg p-4 w-[90%] text-center">
									<p className="text-lg font-medium text-gray-700">
										UPI ID Found:
									</p>
									<p className="text-xl text-green-600 font-semibold break-all">
										{data}
									</p>
								</div>
							)
						)}
					</div>

					{/* Action Buttons */}
					<div className="flex gap-6 mt-6">
						{/* Torch */}
						<button
							onClick={toggleTorch}
							className="flex flex-col items-center gap-1 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg text-white font-semibold shadow-lg"
						>
							{torchOn ? <MdFlashOn size={26} /> : <MdFlashOff size={26} />}
							<span className="text-sm">Torch</span>
						</button>

						{/* Upload */}
						<label className="flex flex-col items-center gap-1 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg text-white font-semibold shadow-lg cursor-pointer">
							<MdUploadFile size={26} />
							<span className="text-sm">Upload</span>
							<input
								type="file"
								accept="image/*"
								onChange={handleFileUpload}
								className="hidden"
							/>
						</label>
					</div>
				</div>
			)}
		</div>
	);
};

export default App;
