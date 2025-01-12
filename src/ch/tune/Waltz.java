package ch.tune;

public class Waltz extends TuneBase {
	
	String[][] forms = {{"/", "/"}, {""}};
	int[] occurence = {65, 35};
	
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
		return "Waltz";
	}

	@Override
	public String getRhytm() {
		return "Waltz";
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