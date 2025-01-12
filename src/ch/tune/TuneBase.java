package ch.tune;

import java.util.HashMap;

public abstract class TuneBase {

	public final String[] tones = 		{"G", "A", "B", "c", "d", "e", "f", "g", "a"};
	
	private final int[] aMajor = 		{ 0 ,  2 ,  1 ,  2 ,  1 ,  2 ,  1 ,  0 ,  2 };
	private final int[] dMajor =		{ 1 ,  2 ,  1 ,  1 ,  2 ,  1 ,  2 ,  1 ,  2 };
	private final int[] gMajor =		{ 2 ,  1 ,  2 ,  0 ,  2 ,  1 ,  1 ,  2 ,  1 };
	
	private final int[] bDoric = 		{ 0 ,  1 ,  2 ,  1 ,  2 ,  1 ,  2 ,  0 ,  1 };
	private final int[] eDoric =		{ 2 ,  1 ,  2 ,  1 ,  1 ,  2 ,  1 ,  2 ,  1 };
	private final int[] fDoric =		{ 0 ,  2 ,  1 ,  2 ,  0 ,  1 ,  2 ,  0 ,  2 };

	private final int[] bPhrygic =		{ 1 ,  1 ,  2 ,  0 ,  2 ,  1 ,  2 ,  1 ,  1 };
	private final int[] ePhrygic =		{ 2 ,  1 ,  2 ,  0 ,  1 ,  2 ,  0 ,  2 ,  1 };
	private final int[] fPhrygic =		{ 1 ,  2 ,  1 ,  2 ,  1 ,  1 ,  2 ,  1 ,  2 };
	
	private final int[] aLydic = 		{ 0 ,  2 ,  1 ,  2 ,  0 ,  2 ,  1 ,  0 ,  2 };
	private final int[] dLydic =		{ 0 ,  2 ,  1 ,  1 ,  2 ,  1 ,  2 ,  0 ,  2 };
	private final int[] gLydic =		{ 2 ,  1 ,  2 ,  1 ,  2 ,  1 ,  1 ,  2 ,  1 };

	private final int[] aMixolydic = 	{ 1 ,  2 ,  1 ,  2 ,  1 ,  2 ,  1 ,  1 ,  2 };
	private final int[] dMixolydic =	{ 1 ,  2 ,  1 ,  0 ,  2 ,  1 ,  2 ,  1 ,  2 };
	private final int[] gMixolydic =	{ 1 ,  2 ,  1 ,  0 ,  2 ,  1 ,  0 ,  2 ,  2 };
	
	private final int[] bMinor =		{ 1 ,  1 ,  2 ,  1 ,  2 ,  1 ,  2 ,  1 ,  1 };
	private final int[] eMinor =		{ 2 ,  1 ,  2 ,  0 ,  1 ,  2 ,  1 ,  2 ,  1 };
	private final int[] fMinor =		{ 0 ,  2 ,  1 ,  2 ,  1 ,  1 ,  2 ,  0 ,  2 };

	private final int[] cLokric =		{ 2 ,  1 ,  1 ,  2 ,  1 ,  2 ,  1 ,  2 ,  1 };

	public final HashMap<Integer, int[]> modes = new HashMap<Integer, int[]>();
	
	public int tuneNumber = 1;
	
	public TuneBase(){
		modes.put(0, aMajor);
		modes.put(1, dMajor);
		modes.put(2, gMajor);

		/*modes.put(3, bDoric);
		modes.put(4, eDoric);
		modes.put(5, fDoric);

		modes.put(6, bPhrygic);
		modes.put(7, ePhrygic);
		modes.put(8, fPhrygic);

		modes.put(9, aLydic);
		modes.put(10, dLydic);
		modes.put(11, gLydic);

		modes.put(12, aMixolydic);
		modes.put(13, dMixolydic);
		modes.put(14, gMixolydic);*/
		
		modes.put(15, bMinor);
		modes.put(16, eMinor);
		modes.put(17, fMinor);
		
		modes.put(18, cLokric);
	}
	
	public String getTitle(int i){
		switch(i){
		case 0:
			return "A-Major";
		case 1:
			return "D-Major";
		case 2:
			return "G-Major";
		case 3:
			return "B-Doric";
		case 4:
			return "E-Doric";
		case 5:
			return "F-Doric";
		case 6:
			return "B-Phrygic";
		case 7:
			return "E-Phrygic";
		case 8:
			return "F-Phrygic";
		case 9:
			return "A-Lydic";
		case 10:
			return "D-Lydic";
		case 11:
			return "G-Lydic";
		case 12:
			return "A-Mixolydic";
		case 13:
			return "D-Mixolydic";
		case 14:
			return "G-Mixolydic";
		case 15:
			return "B-Minor";
		case 16:
			return "E-Minor";
		case 17:
			return "F-Minor";
		case 18:
			return "C-Lokric";
		default:
			return "";
		}
	}
	
	public abstract String[][] getUsedForms();

	public abstract int[] getUsedFormsOccurence();

	public abstract int getNumberOfForms();

	public abstract String getNominalLength();

	public abstract String getName();
	
	public abstract String getRhytm();
	
	public abstract String getTempo();
	
	public abstract boolean doRepeatParts();
	
	public abstract String getMeasure();
}