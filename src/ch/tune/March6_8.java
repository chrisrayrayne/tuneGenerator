package ch.tune;

public class March6_8 extends TuneBase {
	
	String[][] forms = {{"3"}, {">", "", ""}, {"<", "", ""}, {"2", ""}, {"", "2"}};
	int[] occurence = {10, 40, 20, 15, 15};

	@Override
	public String[][] getUsedForms() {
		return forms;
	}

	@Override
	public int[] getUsedFormsOccurence() {
		return occurence;
	}

	@Override
	public int getNumberOfForms() {
		return 2;
	}

	@Override
	public String getNominalLength() {
		return "1/8";
	}

	@Override
	public String getName() {
		return "6_8-March";
	}

	@Override
	public String getRhytm() {
		return "March";
	}

	@Override
	public String getTempo() {
		return "3/8=84";
	}

	@Override
	public boolean doRepeatParts() {
		return true;
	}

	@Override
	public String getMeasure() {
		return "6/8";
	}
}