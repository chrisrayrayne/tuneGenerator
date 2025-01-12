package ch.tune;

public abstract class Jig extends TuneBase {

	String[][] forms = {{"", "", ""}, {"", "2"}, {"2", ""}};
	int[] occurence = {70, 15, 15};
	
	@Override
	public String[][] getUsedForms() {
		return forms;
	}

	@Override
	public int[] getUsedFormsOccurence() {
		return occurence;
	}

	@Override
	public String getNominalLength() {
		return "1/8";
	}

	@Override
	public String getName() {
		return "Jig";
	}

	@Override
	public String getTempo() {
		return "105";
	}

	@Override
	public String getRhytm() {
		return "Jig";
	}
}