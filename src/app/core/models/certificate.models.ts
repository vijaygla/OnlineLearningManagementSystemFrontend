export interface Certificate {
  id: string;
  studentId: string;
  courseId: string;
  studentName: string;
  courseTitle: string;
  certificateNumber: string;
  issueDate: string;
  isRevoked: boolean;
}

export interface IssueCertificateRequest {
  studentId: string;
  courseId: string;
  studentName: string;
  courseTitle: string;
}

export interface CertificateVerificationResponse {
  isValid: boolean;
  certificate: Certificate | null;
}
