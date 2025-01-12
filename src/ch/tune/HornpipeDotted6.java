package ch.tune;

public class HornpipeDotted6 extends Hornpipe {
	
	String[][] forms = {{"2"}, {"", ""}, {"", "/<", "/"}, {"/<", "/", ""}, {"/>", "/", "/>", "/"}};
	int[] occurence = {10, 10, 20, 20, 50};

	@Override
	public int getNumberOfForms() {
		return 2;
	}
	
	@Override
	public String getName(){
		return super.getName()+"-Dotted6";
	}

	@Override
	public String[][] getUsedForms() {
		return forms;
	}

	@Override
	public int[] getUsedFormsOccurence() {
		return occurence;
	}
}