package ch.tune;

public class March2_4DottedAll extends March2_4 {

	String[][] forms = {{""}, {"/2", "/2"}, {"/2>", "/2"}, {"/2<", "/2"},
						{"/4>", "/4", "/4>", "/4"}, {"/4>", "/4", "/4<", "/4"}, {"/4<", "/4", "/4>", "/4"}, {"/4<", "/4", "/4<", "/4"}};
	int[] occurence = {10, 20, 20, 20, 50, 50, 50, 50};
	
	@Override
	public String getName(){
		return super.getName()+"-DottedAll";
	}
	
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
		return "1/4";
	}

}
