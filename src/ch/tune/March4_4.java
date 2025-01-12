package ch.tune;

public class March4_4 extends TuneBase{

	String[][] forms = {{""}, {"/2", "/2"}, {"/2>", "/2"}, {"/2<", "/2"}};
	int[] occurence = {25, 40, 25, 10};
	
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
		return 4;
	}

	@Override
	public String getNominalLength() {
		return "1/4";
	}

	@Override
	public String getName() {
		return "4_4-March";
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
		return false;
	}

	@Override
	public String getMeasure() {
		return "4/4";
	}
	
}
