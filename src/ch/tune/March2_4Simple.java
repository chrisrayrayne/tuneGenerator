package ch.tune;

public class March2_4Simple extends March2_4 {

	String[][] forms = {{""}, {"/2", "/2"}, {"/2>", "/2"}, {"/2<", "/2"}};
	int[] occurence = {10, 30, 30, 30};
	
	@Override
	public String getName(){
		return super.getName()+"-Simple";
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
