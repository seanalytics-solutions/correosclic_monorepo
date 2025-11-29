export enum ComplaintStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

export enum ComplaintType {
  PRODUCT_ISSUE = 'product_issue',
  SERVICE_ISSUE = 'service_issue',
  DELIVERY_ISSUE = 'delivery_issue',
  OTHER = 'other',
}

export enum ComplaintPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum ComplaintResolution {
  REFUND = 'refund',
  REPLACEMENT = 'replacement',
  REPAIR = 'repair',
  NONE = 'none',
}
