package ch.tune;

public class Strathspey extends TuneBase{

	String[][] forms = {{""}, {"/2>", "/2"}, {"/2<", "/2"}, {"/4", "/4", "/2"}};
	int[] occurence = {20, 35, 35, 10};
	
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
		return "Strathspey";
	}

	@Override
	public String getRhytm() {
		return "Strathspey";
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
