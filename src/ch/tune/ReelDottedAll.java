package ch.tune;

public class ReelDottedAll extends Reel {
	
	String[][] forms = {{"2", "2"}, {"2", ">", ""}, {"2", "<", ""}, {">", "", "2"}, {"<", "", "2"},
						{"<", "", "<", ""}, {"<", "", ">", ""}, {">", "", "<", ""}, {">", "", ">", ""}};
	int[] occurence = {20, 10, 10, 10, 10, 50, 50, 50, 50};
	
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
	public String getName(){
		return super.getName()+"-DottedAll";
	}
}