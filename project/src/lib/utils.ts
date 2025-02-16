import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { jsPDF } from "jspdf";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface VerificationData {
  fullName: string;
  rollNumber: string;
  graduationYear: string;
  department: string;
  currentOrganization: string;
  designation: string;
  purpose: string;
  requestId: string;
}

export const generateVerificationForm = (data: VerificationData) => {
  const doc = new jsPDF();

  // Add Institute Logo
  const logoURL = "public/WhatsApp Image 2025-02-12 at 23.28.05_0a364ca2.jpg"; // Replace with the path to the institute's logo image
  const logoWidth = 30; // Adjust as necessary
  const logoHeight = 30; // Adjust as necessary

  doc.addImage(logoURL, "PNG", 10, 10, logoWidth, logoHeight);

  // Add Institute Header
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Dr. B. R. Ambedkar National Institute of Technology", 105, 25, {
    align: "center",
  });
  doc.setFontSize(12);
  doc.text("Jalandhar - 144011, Punjab (India)", 105, 32, { align: "center" });
  doc.text("Website: www.nitj.ac.in | Email: registrar@nitj.ac.in", 105, 38, {
    align: "center",
  });

  // Add Form Title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("ALUMNI VERIFICATION REQUEST FORM", 105, 55, { align: "center" });

  // Add Reference Number and Date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Ref No: NITJ/AL/VRF/${data.requestId}`, 20, 70);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 70);

  // Add Passport Photo Box
  doc.rect(150, 75, 40, 45); // x, y, width, height
  doc.text("Paste Passport", 170, 90, { align: "center" });
  doc.text("Size Photo Here", 170, 95, { align: "center" });

  // Section: Personal Details
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("1. PERSONAL DETAILS", 20, 95);

  // Add Form Fields
  const startY = 110;
  const lineHeight = 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Full Name:", 20, startY);
  doc.text(data.fullName, 60, startY);

  doc.text("Roll Number:", 20, startY + lineHeight);
  doc.text(data.rollNumber, 60, startY + lineHeight);

  doc.text("Batch Year:", 20, startY + lineHeight * 2);
  doc.text(data.graduationYear, 60, startY + lineHeight * 2);

  doc.text("Department:", 20, startY + lineHeight * 3);
  doc.text(data.department, 60, startY + lineHeight * 3);

  doc.text("Current Organization:", 20, startY + lineHeight * 4);
  doc.text(data.currentOrganization, 60, startY + lineHeight * 4);

  doc.text("Designation:", 20, startY + lineHeight * 5);
  doc.text(data.designation, 60, startY + lineHeight * 5);

  // Section: Declaration
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("2. DECLARATION", 20, startY + lineHeight * 7);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const declaration =
    "I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that any false or misleading information may result in the cancellation of my verification request.";
  const splitDeclaration = doc.splitTextToSize(declaration, 170);
  doc.text(splitDeclaration, 20, startY + lineHeight * 8);

  // Signature Fields
  const signatureY = startY + lineHeight * 12;
  doc.line(20, signatureY, 80, signatureY); // Applicant signature line
  doc.text("Signature of Applicant", 20, signatureY + 5);

  doc.line(120, signatureY, 180, signatureY); // HOD signature line
  doc.text("Signature of HOD", 120, signatureY + 5);

  // Section: Office Use
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("3. FOR OFFICE USE ONLY", 20, signatureY + lineHeight * 3);

  // Verification Status Box
  doc.rect(20, signatureY + lineHeight * 4, 170, 30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Verification Status:", 25, signatureY + lineHeight * 5);
  doc.text("Remarks:", 25, signatureY + lineHeight * 6);

  // Footer Note
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(
    "This document is computer generated and does not require physical signature.",
    105,
    290,
    { align: "center" }
  );

  // Save PDF
  doc.save(`verification-form-${data.requestId}.pdf`);
};
