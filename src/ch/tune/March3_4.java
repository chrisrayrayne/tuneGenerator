package ch.tune;

public class March3_4 extends TuneBase {
	
	String[][] forms = {{""}, {"/2", "/2"}, {"/2>", "/2"}, {"/2<", "/2"}};
	int[] occurence = {10, 10, 50, 30};

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
		return 3;
	}

	@Override
	public String getNominalLength() {
		return "1/4";
	}

	@Override
	public String getName() {
		return "3_4-March";
	}

	@Override
	public String getRhytm() {
		return "March";
	}

	@Override
	public String getTempo() {
		return "1/4=110";
	}

	@Override
	public boolean doRepeatParts() {
		return true;
	}

	@Override
	public String getMeasure() {
		return "3/4";
	}

}
