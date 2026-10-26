export interface GarmentData {
  id: string;
  name: string;
  type: 'varsity' | 'hoodie' | 'crewneck' | 'cardigan' | 'field_jacket' | 'denim' | 'chore_coat' | 'grey_hoodie' | 'canvas_jacket' | 'flannel';
  category: string;
  price: string;
  colorName: string;
  colorHex: string;
  secondaryColorHex?: string;
  accentColorHex?: string;
  description: string;
  details: string[];
  sizes: string[];
  fit: string;
  material: string;
  pattern?: 'stripes' | 'plaid' | 'solid' | 'denim' | 'piping';
  railOffset: number; // Position along the curved rail (-1 to 1)
  hangerType: 'coat' | 'clip'; // clip for jeans/trousers, coat for jackets/sweaters
}

export interface GarmentInteractionState {
  hoveredId: string | null;
  selectedId: string | null;
  isInspecting: boolean;
  inspectRotation: number; // 0 for front, Math.PI for back
}
